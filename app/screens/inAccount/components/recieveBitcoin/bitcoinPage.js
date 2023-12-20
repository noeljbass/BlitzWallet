import {
  inProgressSwap,
  receiveOnchain,
} from '@breeztech/react-native-breez-sdk';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {COLORS, CENTER} from '../../../../constants';
import QRCode from 'react-native-qrcode-svg';

export default function BitcoinPage(props) {
  const [generatingQrCode, setGeneratingQrCode] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';
  // const [swapInfo, setSwapInfo] = useState({});
  useEffect(() => {
    if (props.selectedRecieveOption != 'bitcoin') return;

    // generateSwapAddress();
  }, [props.selectedRecieveOption]);
  return (
    <View
      style={{
        display: props.selectedRecieveOption === 'bitcoin' ? 'flex' : 'none',
      }}>
      <View style={[styles.qrcodeContainer]}>
        {generatingQrCode && (
          <ActivityIndicator
            size="large"
            color={isDarkMode ? COLORS.darkModeText : COLORS.lightModeText}
          />
        )}
        {!generatingQrCode && (
          <QRCode
            size={250}
            value={
              props.generatedAddress
                ? props.generatedAddress
                : 'Thanks for using Blitz!'
            }
            color={isDarkMode ? COLORS.darkModeText : COLORS.lightModeText}
            backgroundColor={
              isDarkMode
                ? COLORS.darkModeBackground
                : COLORS.lightModeBackground
            }
          />
        )}
      </View>
    </View>
  );

  async function generateSwapAddress() {
    try {
      setGeneratingQrCode(true);
      const swapInfo = await receiveOnchain({});
      const swapInProgress = await inProgressSwap();

      console.log(swapInProgress, 'TEST');
      props.setGeneratedAddress(swapInfo.bitcoinAddress);

      setGeneratingQrCode(false);

      // Send your funds to the below bitcoin address
      // const address = swapInfo.bitcoinAddress;
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  qrcodeContainer: {
    width: '90%',
    maxWidth: 250,
    height: 250,
    ...CENTER,

    marginVertical: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
