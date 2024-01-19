import {useEffect, useState} from 'react';
import {getFiatRates} from '../../../../functions/SDK';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  fetchFiatRates,
  openChannelFee,
  receivePayment,
} from '@breeztech/react-native-breez-sdk';
import QRCode from 'react-native-qrcode-svg';
import {FONT, SIZES, CENTER, COLORS} from '../../../../constants';

export default function LightningPage(props) {
  const [fiatRate, setFiatRate] = useState(0);
  const [generatingQrCode, setGeneratingQrCode] = useState(true);
  const [errorMessageText, setErrorMessageText] = useState('');

  useEffect(() => {
    if (props.selectedRecieveOption != 'lightning') {
      setErrorMessageText('');
      setFiatRate('');
      setGeneratingQrCode(true);
      return;
    }
    if (!props.userSelectedCurrency) return;

    generateLightningInvoice();

    (async () => {
      try {
        const fiatRates = await fetchFiatRates();
        // console.log(props.userSelectedCurrency, 'IN LIGHTNING PAGE');
        const [selectedPrice] = fiatRates.filter(
          rate =>
            rate.coin.toLowerCase() ===
            props.userSelectedCurrency.toLowerCase(),
        );
        // console.log(selectedPrice);
        setFiatRate(selectedPrice.value);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [
    props.selectedRecieveOption,
    props.updateQRCode,
    props.userSelectedCurrency,
  ]);
  return (
    <View
      style={{
        display: props.selectedRecieveOption === 'lightning' ? 'flex' : 'none',
      }}>
      <View style={[styles.qrcodeContainer]}>
        {generatingQrCode && (
          <ActivityIndicator
            size="large"
            color={
              props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText
            }
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
            color={
              props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText
            }
            backgroundColor={
              props.isDarkMode
                ? COLORS.darkModeBackground
                : COLORS.lightModeBackground
            }
          />
        )}
      </View>
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.valueAmountText,
            {
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          {(props.sendingAmount / 1000).toLocaleString()} sat /{' '}
          {((fiatRate / 100000000) * (props.sendingAmount / 1000)).toFixed(2)}{' '}
          {props.userSelectedCurrency}
        </Text>
        <Text
          style={[
            styles.valueAmountText,
            {
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          {props.paymentDescription
            ? props.paymentDescription
            : 'no description'}
        </Text>
      </View>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessageText}</Text>
      </View>
    </View>
  );

  async function generateLightningInvoice() {
    try {
      if (props.sendingAmount === 0) {
        setGeneratingQrCode(true);
        setErrorMessageText('Must recieve more than 0 sats');
        return;
      }
      const channelFee = await openChannelFee({
        amountMsat: props.sendingAmount,
      });

      setErrorMessageText('');
      setGeneratingQrCode(true);

      if (channelFee?.usedFeeParams) {
        setErrorMessageText(
          `Amount is above your reciveing capacity. Sending this payment will incur a ${Math.ceil(
            channelFee.feeMsat / 1000,
          ).toLocaleString()} sat fee`,
        );
      }

      const invoice = await receivePayment({
        amountMsat: props.sendingAmount,
        description: props.paymentDescription,
      });

      if (invoice) {
        setGeneratingQrCode(false);
        props.setGeneratedAddress(invoice.lnInvoice.bolt11);
      }
    } catch (err) {
      console.log(err, 'RECIVE ERROR');
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

  amountContainer: {
    alignItems: 'center',
    ...CENTER,
  },
  valueAmountText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
    marginBottom: 10,
  },

  errorContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    ...CENTER,
  },
  errorText: {
    color: 'red',
    fontSize: SIZES.large,
    fontFamily: FONT.Descriptoin_Regular,
    textAlign: 'center',
  },
});
