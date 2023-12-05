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
      visible={props.isDisplayed}
      style={{backgroundColor: COLORS.background}}>
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
          setSendPayment={props.setSendPayment}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,

    display: 'flex',
    position: 'relative',
  },
});
