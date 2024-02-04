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
  registerWebhook,
  serviceHealthCheck,
  setLogStream,
} from '@breeztech/react-native-breez-sdk';
import NavBar from '../../components/admin/homeComponents/navBar';
import HomeLightning from '../../components/admin/homeComponents/homeLightning';
import {getTransactions} from '../../functions/SDK';
import {useGlobalContextProvider} from '../../../context-store/context';
import {ConfigurePushNotifications} from '../../hooks/setNotifications';
import {useNavigation} from '@react-navigation/native';

export default function AdminHome() {
  const isInitialRender = useRef(true);
  const navigate = useNavigation();
  const [breezEvent, setBreezEvent] = useState({});
  const {theme, toggleNodeInformation, nodeInformation} =
    useGlobalContextProvider();
  const expoPushToken = ConfigurePushNotifications();

  // SDK events listener

  const logHandler = logEntry => {
    if (logEntry.level != 'TRACE') {
      console.log(`[${logEntry.level}]: ${logEntry.line}`);
    }
  };

  function onBreezEvent(e) {
    console.log(e);
    if (
      e?.type != 'invoicePaid' &&
      e?.type != 'paymentSucceed' &&
      e?.type != 'paymentFailed'
    )
      return;
    setBreezEvent(e);
    updateGlobalNodeInformation(e);

    if (
      e?.type === 'invoicePaid' &&
      e.details.payment.description?.includes('bwrfd')
    )
      return;

    // if (e.details.payment.description?.includes('bwrfd')) return;
    if (navigate.canGoBack()) navigate.navigate('HomeAdmin');
    navigate.navigate('ConfirmTxPage', {
      theme: theme,
      for: e.type,
      information: e,
    });
  }

  useEffect(() => {
    initWallet();
  }, [expoPushToken]);

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
        <HomeLightning />
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

    if (Object.keys(expoPushToken).length != 0) {
      try {
        console.log(expoPushToken, 'NETLIFY WEBHOOK');
        console.log(
          `https://blitz-wallet.com/.netlify/functions/notify?platform=${expoPushToken?.type}&token=${expoPushToken?.data}`,
        );
        await registerWebhook(
          `https://blitz-wallet.com/.netlify/functions/notify?platform=${expoPushToken?.type}&token=${expoPushToken?.data}`,
        );
      } catch (err) {
        console.log(err);
      }
    }

    try {
      if (isInitialRender.current) {
        const response = await connectToNode(onBreezEvent);
        // console.log(response);
        // setErrMessage(response.errMessage);

        if (response.isConnected && (response.reason || !response.reason)) {
          const nodeAmount = await nodeInfo();
          const transactions = await getTransactions();
          const heath = await serviceHealthCheck();
          const msatToSat = nodeAmount.channelsBalanceMsat / 1000;
          console.log(nodeAmount, heath, 'TESTIG');

          if (nodeAmount.connectedPeers.length === 0) reconnectToLSP();

          // await setLogStream(logHandler);
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
        isInitialRender.current = false;
      }
    } catch (err) {
      console.log(err, 'homepage connection to node err');
    }
  }

  async function updateGlobalNodeInformation() {
    const transactions = await getTransactions();
    const nodeState = await nodeInfo();
    const msatToSat = nodeState.channelsBalanceMsat / 1000;

    toggleNodeInformation({
      transactions: transactions,
      userBalance: msatToSat,
      inboundLiquidityMsat: nodeState.inboundLiquidityMsats,
      blockHeight: nodeState.blockHeight,
      onChainBalance: nodeState.onchainBalanceMsat,
    });
    await setLocalStorageItem(
      'breezInfo',
      JSON.stringify([
        transactions,
        msatToSat,
        nodeState.inboundLiquidityMsats,
        nodeState.blockHeight,
        nodeState.onchainBalanceMsat,
      ]),
    );
  }

  async function reconnectToLSP() {
    try {
      const availableLsps = await listLsps();
      console.log(availableLsps, 'TT');
      await connectLsp(availableLsps[0].id);
    } catch (err) {
      toggleNodeInformation({
        didConnectToNode: false,
      });
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
