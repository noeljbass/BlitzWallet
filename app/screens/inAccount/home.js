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
import NavBar from '../../components/admin/homeComponents/navBar';
import HomeLightning from '../../components/admin/homeComponents/homeLightning';

import {getTransactions} from '../../functions/SDK';

export default function AdminHome({navigation: {navigate}}) {
  const isInitialRender = useRef(true);
  const [breezInformation, setBreezInformation] = useState({
    didConnectToNode: false,
    transactions: [],
    userBalance: 0,
  });

  const [breezEvent, setBreezEvent] = useState({});
  const hookDarkMode = useColorScheme() === 'dark';
  const [isDarkMode, setIsDarkMode] = useState(hookDarkMode);

  // SDK events listener

  const onBreezEvent = e => {
    console.log(e.type, 'IN FUNCTION EVENT');
    if (e?.type != 'invoicePaid' && e?.type != 'paymentSucceed') return;

    setBreezEvent(e);
  };

  useEffect(() => {
    initWallet(
      isInitialRender,
      setBreezInformation,
      breezEvent,
      setIsDarkMode,
      onBreezEvent,
    );
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
      </SafeAreaView>
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

        if (
          savedBreezInfo &&
          savedBreezInfo[0]?.toString() === transactions?.toString()
        )
          return;

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
