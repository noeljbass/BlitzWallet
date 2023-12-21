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
  console.log('SEND BITCOIN MAIN PAGE');
  const [scanned, setScanned] = useState(false);
  const [BTCadress, setBTCadress] = useState('');

  useEffect(() => {
    if (props.confirmPageDisplayed) {
      setScanned(false);
      props.setSendPayment(false);
      setBTCadress('');
    }
  }, [props.confirmPageDisplayed]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}
      style={styles.containr}>
      <SendPaymentScreenOptions
        setBTCadress={setBTCadress}
        BTCadress={BTCadress}
        setScanned={setScanned}
        setSendPayment={props.setSendPayment}
        isDarkMode={props.isDarkMode}
      />

      <SendPaymentScreen
        isDisplayed={scanned}
        setScanned={setScanned}
        BTCadress={BTCadress}
        setSendPayment={props.setSendPayment}
        isDarkMode={props.isDarkMode}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  containr: {
    flex: 1,

    display: 'flex',
    position: 'relative',
  },
});
