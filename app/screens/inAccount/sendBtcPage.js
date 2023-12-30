import {StyleSheet, View} from 'react-native';

import {useState} from 'react';
import SendPaymentScreen from '../../components/admin/homeComponents/sendBitcoin/sendPaymentScreen';
import SendPaymentScreenOptions from '../../components/admin/homeComponents/sendBitcoin/screenOptions';

export default function SendPaymentHome(props) {
  console.log('SEND BITCOIN MAIN PAGE');
  const [scanned, setScanned] = useState(false);
  const [BTCadress, setBTCadress] = useState('');
  const isDarkMode = props.route.params.isDarkMode;

  return (
    <View style={styles.container}>
      <SendPaymentScreenOptions
        setBTCadress={setBTCadress}
        BTCadress={BTCadress}
        setScanned={setScanned}
        isDarkMode={isDarkMode}
      />
      <SendPaymentScreen
        isDisplayed={scanned}
        setScanned={setScanned}
        setBTCadress={setBTCadress}
        BTCadress={BTCadress}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
