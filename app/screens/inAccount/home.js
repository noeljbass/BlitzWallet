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
import {useEffect, useState} from 'react';

// import {CameraScan} from '../../components/admin';

import {
  retrieveData,
  connectToNode,
  RotatingAnimation,
  userAuth,
} from '../../functions';
import {mnemonicToSeed} from '@breeztech/react-native-breez-sdk';
import HomeLightning from './components/homeLightning';
import {ReceivePaymentHome} from './components/recieveBitcoin';
import {ConnectionToNode} from './components/conectionToNode';

export default function AdminHome({navigation: {navigate}}) {
  // userAuth(navigate);
  // const [bitcoinAmount, setBitcoinAmount] = useState('');
  // const [activeNav, setActiveNav] = useState([true, false]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recivePayment, setRecivePayment] = useState(false);
  const [nodeConnectionPopup, setNodeConnectionPopup] = useState(true);
  const [didConnectToNode, setDidConnectToNode] = useState(false);
  const [breezEvent, setBreezEvent] = useState({});
  // const [screenType, setScreenType] = useState('lightning');
  // const [needToRefresh, setNeedToRefresh] = useState(0);
  // const [manualRefresh, setManualRefresh] = useState(0);
  // SDK events listener
  console.log(breezEvent, 'BreezEvent on home screen');
  const onBreezEvent = e => {
    setBreezEvent(e);
    // console.log(`Received event ${e.type} did that actually work`);
  };
  useState(() => {
    (async () => {
      try {
        const response = await connectToNode(onBreezEvent);
        setDidConnectToNode(response);
      } catch (err) {
        console.log(err, 'homepage connection to node err');
      }
    })();
  }, []);

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
                backgroundColor: didConnectToNode ? 'green' : 'red',
              }}>
              <Image style={styles.imgIcon} source={ICONS.connectionIcon} />
            </TouchableOpacity>
            <View style={styles.icons}></View>
            <View style={styles.icons}></View>
            <View style={styles.icons}></View>
          </View>
        </View>

        <HomeLightning
          // setScreenType={setScreenType}
          setIsCameraActive={setIsCameraActive}
          setRecivePayment={setRecivePayment}
          breezEvent={breezEvent}
          // needToRefresh={needToRefresh}
          // setNeedToRefresh={setNeedToRefresh}
        />

        {/* main content */}
        {/* <CameraScan
        for={screenType}
        isCameraActive={isCameraActive}
        setIsCameraActive={setIsCameraActive}
        setNeedToRefresh={setNeedToRefresh}
        bitcoinAmount={bitcoinAmount}
      /> */}

        <ReceivePaymentHome
          isDisplayed={recivePayment}
          setRecivePayment={setRecivePayment}
          breezEvent={breezEvent}
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

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CENTER,
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
    width: 20,
    height: 20,
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
