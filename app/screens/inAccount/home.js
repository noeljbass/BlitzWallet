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
  receivePayment,
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
import globalOnBreezEvent from '../../functions/globalOnBreezEvent';

export default function AdminHome() {
  const isInitialRender = useRef(true);
  const navigate = useNavigation();
  const onBreezEvent = globalOnBreezEvent();

  const {
    theme,
    toggleNodeInformation,
    toggleBreezContextEvent,
    breezContextEvent,
  } = useGlobalContextProvider();
  const expoPushToken = ConfigurePushNotifications();

  // function onBreezEvent(e) {
  //   if (
  //     e?.type != 'invoicePaid' &&
  //     e?.type != 'paymentSucceed' &&
  //     e?.type != 'paymentFailed'
  //   )
  //     return;

  //   updateGlobalNodeInformation(e);
  //   toggleBreezContextEvent(e);

  //   if (
  //     e?.type === 'invoicePaid' &&
  //     e.details.payment.description?.includes('bwrfd')
  //   )
  //     return;

  //   // if (e.details.payment.description?.includes('bwrfd')) return;
  //   if (navigate.canGoBack()) navigate.navigate('HomeAdmin');
  //   navigate.navigate('ConfirmTxPage', {
  //     theme: theme,
  //     for: e.type,
  //     information: e,
  //   });
  // }

  console.log(breezContextEvent, 'BREEZ CONTEXT EVENT');

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
        <NavBar />
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
          const nodeState = await nodeInfo();
          const transactions = await getTransactions();
          const heath = await serviceHealthCheck();
          const msatToSat = nodeState.channelsBalanceMsat / 1000;
          console.log(nodeState, heath, 'TESTIG');

          if (nodeState.connectedPeers.length === 0) reconnectToLSP();

          // await setLogStream(logHandler);
          // const healthCheck = await serviceHealthCheck();
          // console.log(healthCheck);

          // console.log(nodeState);

          toggleNodeInformation({
            didConnectToNode: response.isConnected,
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
          await receivePayment({
            amountMsat: 1000,
            description: '',
          });
        }
        // else if (response.isConnected && !response.reason) {
        //   toggleNodeInformation({
        //     didConnectToNode: response.isConnected,
        //   });
        // }
        isInitialRender.current = false;
      }
    } catch (err) {
      toggleNodeInformation({
        didConnectToNode: false,
      });
      console.log(err, 'homepage connection to node err');
    }
  }

  // async function updateGlobalNodeInformation(e) {
  //   const transactions = await getTransactions();
  //   const nodeState = await nodeInfo();
  //   const msatToSat = nodeState.channelsBalanceMsat / 1000;

  //   toggleNodeInformation({
  //     transactions: transactions,
  //     userBalance:
  //       e.type === 'invoicePaid'
  //         ? e.details.payment.amountMsat / 1000 + msatToSat
  //         : msatToSat,
  //     inboundLiquidityMsat:
  //       e.type === 'invoicePaid'
  //         ? Math.abs(
  //             e.details.payment.amountMsat / 1000 -
  //               nodeState.inboundLiquidityMsats,
  //           )
  //         : nodeState.inboundLiquidityMsats,
  //     blockHeight: nodeState.blockHeight,
  //     onChainBalance: nodeState.onchainBalanceMsat,
  //   });
  //   await setLocalStorageItem(
  //     'breezInfo',
  //     JSON.stringify([
  //       transactions,
  //       msatToSat,
  //       nodeState.inboundLiquidityMsats,
  //       nodeState.blockHeight,
  //       nodeState.onchainBalanceMsat,
  //     ]),
  //   );
  // }

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
