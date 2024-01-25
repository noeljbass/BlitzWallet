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
} from '@breeztech/react-native-breez-sdk';
import NavBar from '../../components/admin/homeComponents/navBar';
import HomeLightning from '../../components/admin/homeComponents/homeLightning';
import {getTransactions} from '../../functions/SDK';
import {useGlobalContextProvider} from '../../../context-store/context';

export default function AdminHome({navigation: {navigate}, route}) {
  const isInitialRender = useRef(true);
  const [breezEvent, setBreezEvent] = useState({});
  const {theme, setNodeInformation} = useGlobalContextProvider();

  // SDK events listener

  const onBreezEvent = e => {
    console.log(e.type, 'IN FUNCTION EVENT');
    if (
      e?.type != 'invoicePaid' &&
      e?.type != 'paymentSucceed' &&
      e?.type != 'paymentFailed'
    )
      return;

    console.log('DID MAKE IT THROUGH LOGIC');

    setBreezEvent(e);
  };

  useEffect(() => {
    initWallet(
      isInitialRender,
      setNodeInformation,
      breezEvent,
      onBreezEvent,
      // setErrMessage,
    );
  }, [breezEvent]);

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
}

async function initBalanceAndTransactions(setNodeInformation) {
  try {
    const savedBreezInfo = await getLocalStorageItem('breezInfo');

    if (savedBreezInfo) {
      setNodeInformation(prev => {
        return {
          ...prev,
          didConnectToNode: false,
          transactions: JSON.parse(savedBreezInfo)[0],
          userBalance: JSON.parse(savedBreezInfo)[1],
          inboundLiquidityMsat: JSON.parse(savedBreezInfo)[2],
          blockHeight: JSON.parse(savedBreezInfo)[3],
          onChainBalance: JSON.parse(savedBreezInfo)[4],
        };
      });
    }
  } catch (err) {
    console.log(err);
  }
}
async function initWallet(
  isInitialRender,
  setNodeInformation,
  breezEvent,
  onBreezEvent,
  // setErrMessage,
) {
  // let savedBreezInfo;
  if (isInitialRender.current) {
    console.log('RUNNING');
    console.log('HOME RENDER BREEZ EVENT FIRST LOAD');
    isInitialRender.current = false;

    initBalanceAndTransactions(setNodeInformation);

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
        // await setLogStream(logHandler);
        // const healthCheck = await serviceHealthCheck();
        // console.log(healthCheck);

        // console.log(nodeAmount);
        console.log(nodeAmount, heath);

        setNodeInformation(prev => {
          return {
            ...prev,
            didConnectToNode: response.isConnected,
            transactions: transactions,
            userBalance: msatToSat,
            inboundLiquidityMsat: nodeAmount.inboundLiquidityMsats,
            blockHeight: nodeAmount.blockHeight,
            onChainBalance: nodeAmount.onchainBalanceMsat,
          };
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
        setNodeInformation(prev => {
          return {
            ...prev,
            didConnectToNode: response.isConnected,
          };
        });
      }
    } catch (err) {
      console.log(err, 'homepage connection to node err');
    }
  } else {
    if (Object.keys(breezEvent).length === 0) return;

    const transactions = await getTransactions();
    const nodeAmount = await nodeInfo();

    const msatToSat = nodeAmount.channelsBalanceMsat / 1000;

    setNodeInformation(prev => {
      return {
        ...prev,
        transactions: transactions,
        userBalance: msatToSat,
        inboundLiquidityMsat: nodeAmount.inboundLiquidityMsats,
        blockHeight: nodeAmount.blockHeight,
        onChainBalance: nodeAmount.onchainBalanceMsat,
      };
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

    console.log('HOME RENDER PAID INVOINCE');
  }
}

async function reconnectToLSP() {
  try {
    const [availableLsps] = await listLsps();
    await connectLsp(availableLsps.id);
  } catch (err) {
    console.log(err);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
