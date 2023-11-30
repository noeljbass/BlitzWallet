import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Modal,
  SafeAreaView,
} from 'react-native';

import {useEffect, useState} from 'react';

import {COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import SendPaymentScreen from './sendPaymentScreen';
import SendPaymentScreenOptions from './screenOptions';

// import {ManualAddressInput} from './manualAddressInput';

export default function SendPaymentHome(props) {
  const [scanned, setScanned] = useState(false);
  const [BTCadress, setBTCadress] = useState('');
  console.log(scanned, 'HOME');

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}>
      <SafeAreaView style={styles.cameraContainer}>
        <SendPaymentScreenOptions
          setBTCadress={setBTCadress}
          BTCadress={BTCadress}
          setScanned={setScanned}
          setSendPayment={props.setSendPayment}
        />

        <SendPaymentScreen
          isDisplayed={scanned}
          setScanned={setScanned}
          BTCadress={BTCadress}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',

    backgroundColor: COLORS.background,
    zIndex: 5,
    display: 'flex',
    position: 'relative',
  },
  topBar: {
    width: '100%',
    padding: 10,

    flexDirection: 'row',
  },
  headerText: {
    color: 'black',
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginRight: 'auto',
    marginLeft: 'auto',
    fontFamily: FONT.Title_Bold,
  },
  camera: {flex: 1},
  bottomBar: {
    width: '100%',
    height: 50,

    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'white',
  },
  bottomText: {
    width: '100%',
    textAlign: 'center',
    color: 'black',
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: 'transparent',
    fontFamily: FONT.Other_Bold,

    lineHeight: 50,
  },
  arrowIcon: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    zIndex: 1,
    transform: [{translateX: -40}],
    color: 'white',
    backgroundColor: 'white',
    paddingVertical: 2,
    paddingHorizontal: 20,
    alignItems: 'center',

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
});
