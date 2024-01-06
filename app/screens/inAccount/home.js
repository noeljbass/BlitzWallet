import {SafeAreaView, StyleSheet, View} from 'react-native';
import {COLORS} from '../../constants';
import {useContext, useEffect, useRef, useState} from 'react';
import {
  connectToNode,
  setLocalStorageItem,
  getLocalStorageItem,
} from '../../functions';
import {
  listLsps,
  lspId,
  lspInfo,
  nodeInfo,
  serviceHealthCheck,
} from '@breeztech/react-native-breez-sdk';
import NavBar from '../../components/admin/homeComponents/navBar';
import HomeLightning from '../../components/admin/homeComponents/homeLightning';

import {getTransactions} from '../../functions/SDK';
import {useTheme} from '../../../context-store/context';

export default function AdminHome({navigation: {navigate}}) {
  const isInitialRender = useRef(true);
  const [breezInformation, setBreezInformation] = useState({
    didConnectToNode: null,
    transactions: [],
    userBalance: 0,
  });
  const [breezEvent, setBreezEvent] = useState({});
  const {theme, toggleTheme} = useTheme();
  // SDK events listener
  console.log(breezEvent);

  const onBreezEvent = e => {
    console.log(e.type, 'IN FUNCTION EVENT');
    if (
      e?.type != 'invoicePaid' &&
      e?.type != 'paymentSucceed' &&
      e?.type != 'paymentFailed'
    )
      return;

    setBreezEvent(e);
  };

  useEffect(() => {
    initWallet(isInitialRender, setBreezInformation, breezEvent, onBreezEvent);
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
        <NavBar
          breezInformation={breezInformation}
          breezEvent={breezEvent}
          theme={theme}
          // settheme={settheme}

          // setSystemSettingsPopup={setSystemSettingsPopup}
        />
        <HomeLightning
          breezEvent={breezEvent}
          breezInformation={breezInformation}
          theme={theme}
        />
      </SafeAreaView>
    </View>
  );
}

async function initBalanceAndTransactions(setBreezInformation) {
  try {
    const savedBreezInfo = await getLocalStorageItem('breezInfo');

    if (savedBreezInfo) {
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
    }
  } catch (err) {
    console.log(err);
  }
}

async function initWallet(
  isInitialRender,
  setBreezInformation,
  breezEvent,
  onBreezEvent,
) {
  let savedBreezInfo;
  if (isInitialRender.current) {
    console.log('RUNNING');
    console.log('HOME RENDER BREEZ EVENT FIRST LOAD');
    isInitialRender.current = false;

    savedBreezInfo = await initBalanceAndTransactions(setBreezInformation);

    try {
      const response = await connectToNode(onBreezEvent);
      console.log(response);

      if (response.isConnected && response.reason) {
        const nodeAmount = await nodeInfo();
        const transactions = await getTransactions();
        const info = await lspInfo();
        const heath = await serviceHealthCheck();
        const msatToSat = nodeAmount.channelsBalanceMsat / 1000;

        // await setLogStream(logHandler);
        // const healthCheck = await serviceHealthCheck();
        // console.log(healthCheck);

        console.log(heath);
        console.log(info, 'LSPPSSS');

        if (!info.id) reconnectToLSP();

        setBreezInformation(prev => {
          return {
            ...prev,
            didConnectToNode: response.isConnected,
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
      } else if (response.isConnected && !response.reason) {
        setBreezInformation(prev => {
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
