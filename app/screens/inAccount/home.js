import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
} from '../../functions';
import {
  listLsps,
  lspId,
  lspInfo,
  nodeInfo,
} from '@breeztech/react-native-breez-sdk';
import HomeLightning from './components/homeLightning';
import {ReceivePaymentHome} from './components/recieveBitcoin';
import {ConnectionToNode} from './components/conectionToNode';
import {getTransactions} from '../../functions/SDK';
import {SendRecieveBTNs} from './components/sendReciveBTNs';
import {OptionsDropdown} from './components/optionsDropdown';
import {CommonActions} from '@react-navigation/native';

export default function AdminHome({navigation: {navigate}}) {
  const isInitialRender = useRef(true);
  // userAuth(navigate);
  // const [bitcoinAmount, setBitcoinAmount] = useState('');
  // const [activeNav, setActiveNav] = useState([true, false]);
  // const [isCameraActive, setIsCameraActive] = useState(false);
  const [breezInformation, setBreezInformation] = useState({
    didConnectToNode: false,
    transactions: [],
    userBalance: 0,
  });
  const [navViews, setNavViews] = useState({
    features: false,
  });
  // const [transactions, setTransactions] = useState([]);
  // const [userBalance, setUserBalance] = useState(0);
  // const [recivePayment, setRecivePayment] = useState(false);
  const [nodeConnectionPopup, setNodeConnectionPopup] = useState(true);
  // const [didConnectToNode, setDidConnectToNode] = useState(false);
  const [breezEvent, setBreezEvent] = useState({});

  // SDK events listener
  console.log(breezEvent, 'BreezEvent on home screen');

  const onBreezEvent = e => {
    setBreezEvent(e);

    // console.log(`Received event ${e.type} did that actually work`);
  };
  useEffect(() => {
    (async () => {
      if (isInitialRender.current) {
        console.log('HOME RENDER BREEZ EVENT FIRST LOAD');

        try {
          const response = await connectToNode(onBreezEvent);
          if (response) {
            const nodeAmount = await nodeInfo();
            const msatToSat = nodeAmount.channelsBalanceMsat / 1000;
            const transactions = await getTransactions();
            const lsps = await lspInfo();
            console.log(lsps, 'LSPPSSS');

            setBreezInformation(prev => {
              return {
                ...prev,
                didConnectToNode: response,
                transactions: transactions,
                userBalance: msatToSat,
              };
            });
            isInitialRender.current = false;
          }
        } catch (err) {
          console.log(err, 'homepage connection to node err');
        }
      } else {
        if (Object.keys(breezEvent).length === 0) return;
        if (breezEvent.type === 'invoicePaid') {
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
          console.log('HOME RENDER PAID INVOINCE');
        }
        console.log('HOME RENDER BREEZ EVENT');
      }
    })();
  }, [breezEvent]);

  return (
    <View style={Background}>
      <SafeAreaView style={styles.globalContainer}>
        <View style={styles.topBar}>
          <Text style={styles.topBarName}>Blitz Wallet</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => setNodeConnectionPopup(false)}
              style={{
                ...styles.icons,
                backgroundColor: breezInformation.didConnectToNode
                  ? 'green'
                  : 'red',
              }}>
              <Image style={styles.imgIcon} source={ICONS.connectionIcon} />
            </TouchableOpacity>
            <View style={styles.icons}></View>
            <View style={styles.icons}></View>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.icons}
              onPress={() => {
                setNavViews(prev => {
                  return {...prev, features: !prev.features};
                });
              }}>
              <Image style={styles.imgIcon} source={ICONS.toolsIcon} />
            </TouchableOpacity>
            <OptionsDropdown
              setNavViews={setNavViews}
              isDisplayed={navViews.features}
            />
          </View>
        </View>

        <HomeLightning
          // setScreenType={setScreenType}
          // setIsCameraActive={setIsCameraActive}
          // setRecivePayment={setRecivePayment}
          // breezEvent={breezEvent}
          // transactions={transactions}
          breezInformation={breezInformation}
          // setTransactions={setTransactions}
          // userBalance={userBalance}
          // needToRefresh={needToRefresh}
          // setNeedToRefresh={setNeedToRefresh}
        />

        {/* <SendRecieveBTNs
          // setScreenType={props.setScreenType}
          for="lightning"
          // setIsCameraActive={setIsCameraActive}
          setRecivePayment={setRecivePayment}
          // setNeedToRefresh={props.setNeedToRefresh}
        /> */}

        {/* main content */}
        {/* <CameraScan
        for={screenType}
        isCameraActive={isCameraActive}
        setIsCameraActive={setIsCameraActive}
        setNeedToRefresh={setNeedToRefresh}
        bitcoinAmount={bitcoinAmount}
      /> */}

        {/* <ReceivePaymentHome
          isDisplayed={recivePayment}
          setRecivePayment={setRecivePayment}
          transactions={transactions}
        /> */}

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

  //   navigation between Bitcoin and lightning
  navBar: {
    width: '90%',
    maxWidth: 250,

    flexDirection: 'row',

    alignItems: 'cetner',
    justifyContent: 'space-between',

    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 30,
  },
  navBarTextContainer_active: {
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
  navBarTextContainer_inActive: {
    paddingBottom: 5,
  },
  navBarText: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Regular,
  },
  //   main content styling
  mainContent: {
    flex: 1,
    marginTop: 30,
  },
});
