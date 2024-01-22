import {StyleSheet, View} from 'react-native';

import {useEffect, useState} from 'react';
import SendPaymentScreen from '../../components/admin/homeComponents/sendBitcoin/sendPaymentScreen';
import SendPaymentScreenOptions from '../../components/admin/homeComponents/sendBitcoin/screenOptions';
import {useGlobalContextProvider} from '../../../context-store/context';

export default function SendPaymentHome(props) {
  console.log('SEND BITCOIN MAIN PAGE');
  const [scanned, setScanned] = useState(false);
  const [BTCadress, setBTCadress] = useState('');
  const {theme} = useGlobalContextProvider();

  useEffect(() => {
    setScanned(false);
    setBTCadress('');
  }, []);

  return (
    <View style={styles.container}>
      <SendPaymentScreenOptions
        setBTCadress={setBTCadress}
        BTCadress={BTCadress}
        setScanned={setScanned}
        theme={theme}
      />
      <SendPaymentScreen
        isDisplayed={scanned}
        setScanned={setScanned}
        setBTCadress={setBTCadress}
        BTCadress={BTCadress}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
