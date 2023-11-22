import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {Background, CENTER, FONT, ICONS, SIZES} from '../../constants';
import {useState} from 'react';

// import {CameraScan} from '../../components/admin';

// import {ReceivePaymentHome} from '../../components/admin/bitcoin/BitcoinReceivePath/recieveHome';

import {retrieveData, connectToNode, RotatingAnimation} from '../../functions';
import {mnemonicToSeed} from '@breeztech/react-native-breez-sdk';
import HomeLightning from './components/homeLightning';

export default function AdminHome({navigation: {naviage}}) {
  const [bitcoinAmount, setBitcoinAmount] = useState('');
  // const [activeNav, setActiveNav] = useState([true, false]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recivePayment, setRecivePayment] = useState(false);
  const [screenType, setScreenType] = useState('lightning');
  const [needToRefresh, setNeedToRefresh] = useState(0);
  const [manualRefresh, setManualRefresh] = useState(0);
  // useState(() => {
  //   (async () => {
  //     const mnemonic = await retrieveData('key');
  //     const seed = await mnemonicToSeed(mnemonic);

  //     // connectToNode(seed);
  //   })();
  // }, []);

  // function toggleBitcoinFunction(clicked) {
  //   if (clicked === "bitcoin") setActiveNav([true, false]);
  //   else setActiveNav([false, true]);
  // }

  return (
    <View style={Background}>
      <SafeAreaView style={styles.globalContainer}>
        <View style={styles.topBar}>
          <Text style={styles.topBarName}>Blitz Wallet</Text>
          <View style={styles.iconContainer}>
            {/* <RotatingAnimation
              img={ICONS.refreshIcon}
              style={{...styles.icons, backgroundColor: 'transparent'}}
              setManualRefresh={setManualRefresh}
            /> */}

            <View style={styles.icons}></View>
            <View style={styles.icons}></View>
          </View>
        </View>

        <HomeLightning
          setScreenType={setScreenType}
          setIsCameraActive={setIsCameraActive}
          setRecivePayment={setRecivePayment}
          needToRefresh={needToRefresh}
          setNeedToRefresh={setNeedToRefresh}
        />

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
        for={screenType}
      /> */}

        {/* <ExpandedTransaction /> */}
      </SafeAreaView>
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
    width: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icons: {
    width: 25,
    height: 25,
    borderRadius: '50%',
    backgroundColor: 'black',
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
