import {SafeAreaView, StyleSheet, View} from 'react-native';
import {COLORS} from '../../constants';
import {useEffect, useRef, useState} from 'react';
import {
  connectToNode,
  setLocalStorageItem,
  getLocalStorageItem,
} from '../../functions';
import {
  connectLsp,
  listLsps,
  lspInfo,
  nodeInfo,
  serviceHealthCheck,
  setLogStream,
} from '@breeztech/react-native-breez-sdk';
import NavBar from '../../components/admin/homeComponents/navBar';
import HomeLightning from '../../components/admin/homeComponents/homeLightning';
import {getTransactions} from '../../functions/SDK';
import {useGlobalContextProvider} from '../../../context-store/context';

export default function AdminHome({navigation: {navigate}, route}) {
  const [breezEvent, setBreezEvent] = useState({});
  const {theme, toggleNodeInformation} = useGlobalContextProvider();

  // SDK events listener

  const logHandler = logEntry => {
    if (logEntry.level != 'TRACE') {
      console.log(`[${logEntry.level}]: ${logEntry.line}`);
    }
  };

  const onBreezEvent = e => {
    console.log(e.type, 'IN FUNCTION EVENT');
    if (e.type === 'newBlock') {
      (async () => {
        try {
          const breezNodeInfo = await nodeInfo();
          toggleNodeInformation({
            blockHeight: breezNodeInfo.blockHeight,
          });
        } catch (err) {
          console.log(err);
        }
      })();
    }

    if (
      e?.type != 'invoicePaid' &&
      e?.type != 'paymentSucceed' &&
      e?.type != 'paymentFailed'
    )
      return;

    console.log('DID MAKE IT THROUGH LOGIC');
    updateGlobalNodeInformation();
    setBreezEvent(e);
  };

  useEffect(() => {
    initWallet();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView style={styles.container}>
        <NavBar breezEvent={breezEvent} />
        <HomeLightning breezEvent={breezEvent} />
      </SafeAreaView>
    </View>
  );
  async function initBalanceAndTransactions() {
    try {
      const savedBreezInfo = await getLocalStorageItem('breezInfo');

      if (savedBreezInfo) {
        toggleNodeInformation({
          didConnectToNode: false,
          transactions: JSON.parse(savedBreezInfo)[0],
          userBalance: JSON.parse(savedBreezInfo)[1],
          inboundLiquidityMsat: JSON.parse(savedBreezInfo)[2],
          blockHeight: JSON.parse(savedBreezInfo)[3],
          onChainBalance: JSON.parse(savedBreezInfo)[4],
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function initWallet() {
    console.log('HOME RENDER BREEZ EVENT FIRST LOAD');

    initBalanceAndTransactions(toggleNodeInformation);

    try {
      const response = await connectToNode(onBreezEvent);
      // console.log(response);
      // setErrMessage(response.errMessage);

      if (response.isConnected && response.reason) {
        const nodeAmount = await nodeInfo();
        const transactions = await getTransactions();
        const heath = await serviceHealthCheck();
        const msatToSat = nodeAmount.channelsBalanceMsat / 1000;

        if (nodeAmount.connectedPeers.length === 0) reconnectToLSP();

        await setLogStream(logHandler);
        // const healthCheck = await serviceHealthCheck();
        // console.log(healthCheck);

        // console.log(nodeAmount);

        toggleNodeInformation({
          didConnectToNode: response.isConnected,
          transactions: transactions,
          userBalance: msatToSat,
          inboundLiquidityMsat: nodeAmount.inboundLiquidityMsats,
          blockHeight: nodeAmount.blockHeight,
          onChainBalance: nodeAmount.onchainBalanceMsat,
        });

        await setLocalStorageItem(
          'breezInfo',
          JSON.stringify([
            transactions,
            msatToSat,
            nodeAmount.inboundLiquidityMsats,
            nodeAmount.blockHeight,
            nodeAmount.onchainBalanceMsat,
          ]),
        );
      } else if (response.isConnected && !response.reason) {
        toggleNodeInformation({
          didConnectToNode: response.isConnected,
        });
      }
    } catch (err) {
      console.log(err, 'homepage connection to node err');
    }
  }

  async function updateGlobalNodeInformation() {
    const transactions = await getTransactions();
    const node_Info = await nodeInfo();
    const msatToSat = node_Info.channelsBalanceMsat / 1000;
    toggleNodeInformation({
      transactions: transactions,
      userBalance: msatToSat,
      inboundLiquidityMsat: node_Info.inboundLiquidityMsats,
      blockHeight: node_Info.blockHeight,
      onChainBalance: node_Info.onchainBalanceMsat,
    });
    await setLocalStorageItem(
      'breezInfo',
      JSON.stringify([
        transactions,
        msatToSat,
        node_Info.inboundLiquidityMsats,
        node_Info.blockHeight,
        node_Info.onchainBalanceMsat,
      ]),
    );
  }

  async function reconnectToLSP() {
    try {
      const [availableLsps] = await listLsps();
      await connectLsp(availableLsps.id);
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
