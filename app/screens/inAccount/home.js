import {SafeAreaView, StyleSheet, View, useColorScheme} from 'react-native';
import {COLORS} from '../../constants';
import {useEffect, useRef, useState} from 'react';
import {
  connectToNode,
  setLocalStorageItem,
  getLocalStorageItem,
  setColorScheme,
} from '../../functions';
import {
  lspInfo,
  nodeInfo,
  serviceHealthCheck,
} from '@breeztech/react-native-breez-sdk';
import HomeLightning from './components/homeLightning';
import {ConnectionToNode} from './components/conectionToNode';
import {getTransactions} from '../../functions/SDK';

import NavBar from './components/navBar';

export default function AdminHome({navigation: {navigate}}) {
  const isInitialRender = useRef(true);
  const [breezInformation, setBreezInformation] = useState({
    didConnectToNode: false,
    transactions: [],
    userBalance: 0,
  });

  const [nodeConnectionPopup, setNodeConnectionPopup] = useState(true);

  const [breezEvent, setBreezEvent] = useState({});
  const hookDarkMode = useColorScheme() === 'dark';
  const [isDarkMode, setIsDarkMode] = useState(hookDarkMode);

  // SDK events listener
  console.log(breezEvent, 'BreezEvent on home screen');

  const onBreezEvent = e => {
    console.log(e.type, 'IN FUNCTION EVENT');
    if (e?.type != 'invoicePaid' && e?.type != 'paymentSucceed') return;

    setBreezEvent(e);

    // console.log(`Received event ${e.type} did that actually work`);
  };

  useEffect(() => {
    // const logHandler = logEntry => {
    //   if (logEntry.level != 'TRACE') {
    //     console.log(`[${logEntry.level}]: ${logEntry.line}`);
    //   }
    // };

    // (async () => {
    // const savedBreezInfo = await initBalanceAndTransactions(
    //   setBreezInformation,
    // );

    // return;
    initWallet(
      isInitialRender,
      setBreezInformation,
      breezEvent,
      setIsDarkMode,
      onBreezEvent,
    );

    // if (isInitialRender.current) {
    //   console.log('HOME RENDER BREEZ EVENT FIRST LOAD');
    //   isInitialRender.current = false;

    //   try {
    //     const response = await connectToNode(onBreezEvent);

    //     // console.log(response, 'RESPONSE');

    //     if (response) {
    //       // await setLogStream(logHandler);
    //       // const healthCheck = await serviceHealthCheck();
    //       // console.log(healthCheck);

    //       const nodeAmount = await nodeInfo();
    //       const msatToSat = nodeAmount.channelsBalanceMsat / 1000;
    //       const transactions = await getTransactions();
    //       const info = await lspInfo();
    //       const heath = await serviceHealthCheck();
    //       console.log(heath);
    //       console.log(info, 'LSPPSSS');

    //       setBreezInformation(prev => {
    //         return {
    //           ...prev,
    //           didConnectToNode: response,
    //           transactions: transactions,
    //           userBalance: msatToSat,
    //         };
    //       });

    //       if (savedBreezInfo[0].toString() === transactions.toString())
    //         return;

    //       await setLocalStorageItem(
    //         'breezInfo',
    //         JSON.stringify([transactions, msatToSat]),
    //       );
    //     }
    //   } catch (err) {
    //     console.log(err, 'homepage connection to node err');
    //   }
    // } else {
    //   if (Object.keys(breezEvent).length === 0) return;
    //   if (
    //     breezEvent.type === 'invoicePaid' ||
    //     breezEvent.type === 'paymentSucceed'
    //   ) {
    //     const transactions = await getTransactions();
    //     const nodeAmount = await nodeInfo();

    //     const msatToSat = nodeAmount.channelsBalanceMsat / 1000;
    //     setBreezInformation(prev => {
    //       return {
    //         ...prev,
    //         userBalance: msatToSat,
    //         transactions: transactions,
    //       };
    //     });
    //     if (savedBreezInfo[0].toString() === transactions.toString()) return;

    //     await setLocalStorageItem(
    //       'breezInfo',
    //       JSON.stringify([transactions, msatToSat]),
    //     );

    //     console.log('HOME RENDER PAID INVOINCE');
    //   }
    //   // console.log('HOME RENDER BREEZ EVENT');
    // }
    // })();
  }, [breezEvent]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView style={styles.container}>
        <NavBar
          breezInformation={breezInformation}
          nodeConnectionPopup={nodeConnectionPopup}
          setNodeConnectionPopup={setNodeConnectionPopup}
          breezEvent={breezEvent}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}

          // setSystemSettingsPopup={setSystemSettingsPopup}
        />
        <HomeLightning
          breezEvent={breezEvent}
          breezInformation={breezInformation}
          isDarkMode={isDarkMode}
        />

        {/* <ExpandedTransaction /> */}
      </SafeAreaView>
      <ConnectionToNode
        isDisplayed={nodeConnectionPopup}
        hidePopup={setNodeConnectionPopup}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

async function initBalanceAndTransactions(setBreezInformation) {
  try {
    const savedBreezInfo = await getLocalStorageItem('breezInfo');

    if (savedBreezInfo)
      setBreezInformation(prev => {
        return {
          ...prev,
          transactions: JSON.parse(savedBreezInfo)[0],
          userBalance: JSON.parse(savedBreezInfo)[1],
        };
      });
    return new Promise(response => {
      response(savedBreezInfo);
    });
  } catch (err) {
    console.log(err);
  }
}

async function initWallet(
  isInitialRender,
  setBreezInformation,
  breezEvent,
  setIsDarkMode,
  onBreezEvent,
) {
  let savedBreezInfo;
  if (isInitialRender.current) {
    console.log('HOME RENDER BREEZ EVENT FIRST LOAD');
    isInitialRender.current = false;
    const setStyle = await setColorScheme();
    if (setStyle) setIsDarkMode(setStyle);

    savedBreezInfo = await initBalanceAndTransactions(setBreezInformation);

    try {
      const response = await connectToNode(onBreezEvent);

      // console.log(response, 'RESPONSE');

      if (response) {
        // await setLogStream(logHandler);
        // const healthCheck = await serviceHealthCheck();
        // console.log(healthCheck);

        const nodeAmount = await nodeInfo();
        const msatToSat = nodeAmount.channelsBalanceMsat / 1000;
        const transactions = await getTransactions();
        const info = await lspInfo();
        const heath = await serviceHealthCheck();
        console.log(heath);
        console.log(info, 'LSPPSSS');

        setBreezInformation(prev => {
          return {
            ...prev,
            didConnectToNode: response,
            transactions: transactions,
            userBalance: msatToSat,
          };
        });

        if (savedBreezInfo[0]?.toString() === transactions?.toString()) return;

        await setLocalStorageItem(
          'breezInfo',
          JSON.stringify([transactions, msatToSat]),
        );
      }
    } catch (err) {
      console.log(err, 'homepage connection to node err');
    }
  } else {
    if (Object.keys(breezEvent).length === 0) return;
    // if (
    //   breezEvent.type === 'invoicePaid' ||
    //   breezEvent.type === 'paymentSucceed'
    // ) {
    const transactions = await getTransactions();
    const nodeAmount = await nodeInfo();

    const msatToSat = nodeAmount.channelsBalanceMsat / 1000;
    setBreezInformation(prev => {
      return {
        ...prev,
        userBalance: msatToSat,
        transactions: transactions,
      };
    });
    // if (savedBreezInfo[0]?.toString() === transactions?.toString()) return;

    await setLocalStorageItem(
      'breezInfo',
      JSON.stringify([transactions, msatToSat]),
    );

    console.log('HOME RENDER PAID INVOINCE');
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
