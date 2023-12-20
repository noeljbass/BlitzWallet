import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

import {
  Background,
  CENTER,
  COLORS,
  FONT,
  ICONS,
  SIZES,
  SHADOWS,
} from '../../constants';
import {useEffect, useRef, useState} from 'react';

// import {CameraScan} from '../../components/admin';

import {
  retrieveData,
  connectToNode,
  RotatingAnimation,
  userAuth,
  setLocalStorageItem,
  getLocalStorageItem,
} from '../../functions';
import {
  lspInfo,
  nodeInfo,
  serviceHealthCheck,
  setLogStream,
} from '@breeztech/react-native-breez-sdk';
import HomeLightning from './components/homeLightning';
import {ReceivePaymentHome} from './components/recieveBitcoin';
import {ConnectionToNode} from './components/conectionToNode';
import {getTransactions} from '../../functions/SDK';
import {SendRecieveBTNs} from './components/sendReciveBTNs';
import {OptionsDropdown} from './components/optionsDropdown';
import {CommonActions} from '@react-navigation/native';
import NavBar from './components/navBar';
import SystemSettings from './components/settings';
import {getSwapFee, getSwapPairInformation} from '../../functions/LBTC';

export default function AdminHome({navigation: {navigate}}) {
  const isInitialRender = useRef(true);
  const [breezInformation, setBreezInformation] = useState({
    didConnectToNode: false,
    transactions: [],
    userBalance: 0,
  });

  const [nodeConnectionPopup, setNodeConnectionPopup] = useState(true);

  const [breezEvent, setBreezEvent] = useState({});
  const isDarkMode = useColorScheme() === 'dark';

  // SDK events listener
  console.log(breezEvent, 'BreezEvent on home screen');

  const onBreezEvent = e => {
    console.log(e, 'IN FUNCTION EVENT');
    if (e?.type != 'invoicePaid' && e?.type != 'paymentSucceed') return;

    setBreezEvent(e);

    // console.log(`Received event ${e.type} did that actually work`);
  };

  useEffect(() => {
    const logHandler = logEntry => {
      if (logEntry.level != 'TRACE') {
        console.log(`[${logEntry.level}]: ${logEntry.line}`);
      }
    };

    (async () => {
      const savedBreezInfo = await getLocalStorageItem('breezInfo');

      if (savedBreezInfo) {
        setBreezInformation(prev => {
          return {
            ...prev,
            transactions: JSON.parse(savedBreezInfo)[0],
            userBalance: JSON.parse(savedBreezInfo)[1],
          };
        });
      }
      return;

      if (isInitialRender.current) {
        console.log('HOME RENDER BREEZ EVENT FIRST LOAD');
        isInitialRender.current = false;

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

            if (savedBreezInfo[0].toString() === transactions.toString())
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
        if (
          breezEvent.type === 'invoicePaid' ||
          breezEvent.type === 'paymentSucceed'
        ) {
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
          if (savedBreezInfo[0].toString() === transactions.toString()) return;

          await setLocalStorageItem(
            'breezInfo',
            JSON.stringify([transactions, msatToSat]),
          );

          console.log('HOME RENDER PAID INVOINCE');
        }
        // console.log('HOME RENDER BREEZ EVENT');
      }
    })();
  }, [breezEvent]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? COLORS.darkModeBackground
          : COLORS.lightModeBackground,
      }}>
      <SafeAreaView style={styles.globalContainer}>
        <NavBar
          breezInformation={breezInformation}
          nodeConnectionPopup={nodeConnectionPopup}
          setNodeConnectionPopup={setNodeConnectionPopup}
          breezEvent={breezEvent}

          // setSystemSettingsPopup={setSystemSettingsPopup}
        />
        <HomeLightning
          breezEvent={breezEvent}
          breezInformation={breezInformation}
        />

        {/* <ExpandedTransaction /> */}
      </SafeAreaView>
      <ConnectionToNode
        isDisplayed={nodeConnectionPopup}
        hidePopup={setNodeConnectionPopup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    width: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  //   topBar
  topBar: {
    width: '90%',
    height: 50,
    display: 'flex',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CENTER,
    zIndex: 1,
  },
  topBarName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    fontFamily: FONT.Title_Bold,
  },
  iconContainer: {
    width: 170,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icons: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  imgIcon: {
    width: 15,
    height: 15,
  },

  //   main content styling
  mainContent: {
    flex: 1,
    marginTop: 30,
  },
});
