import {useEffect, useState} from 'react';
import {getFiatRates} from '../../../../functions/SDK';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  openChannelFee,
  receivePayment,
} from '@breeztech/react-native-breez-sdk';
import QRCode from 'react-native-qrcode-svg';
import {FONT, SIZES, CENTER, COLORS} from '../../../../constants';

export default function LightningPage(props) {
  const [fiatRate, setFiatRate] = useState(0);
  const [generatingQrCode, setGeneratingQrCode] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');
  console.log(props.sendingAmount * 5, props.paymentDescription, 'TEST');
  useEffect(() => {
    if (props.selectedRecieveOption != 'lightning') {
      setErrorMessageText('');
      setFiatRate('');
      setGeneratingQrCode(false);
      return;
    }

    generateLightningInvoice();

    (async () => {
      const fiatRates = await getFiatRates();
      const [selectedPrice] = fiatRates.filter(rate => rate.coin === 'USD');
      setFiatRate(selectedPrice.value);
    })();
  }, [props.selectedRecieveOption, props.updateQRCode]);
  return (
    <View
      style={{
        display: props.selectedRecieveOption === 'lightning' ? 'flex' : 'none',
      }}>
      <View style={[styles.qrcodeContainer]}>
        {generatingQrCode && (
          <ActivityIndicator size="large" color={COLORS.primary} />
        )}
        {!generatingQrCode && !errorMessageText && (
          <QRCode
            size={250}
            value={
              props.generatedAddress
                ? props.generatedAddress
                : 'Random Input Data'
            }
          />
        )}
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.valueAmountText}>
          {(props.sendingAmount / 1000).toLocaleString()} sat /{' '}
          {((fiatRate / 100000000) * (props.sendingAmount / 1000)).toFixed(2)}{' '}
          {'USD'}
        </Text>
        <Text style={styles.valueAmountText}>
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
      const channelFee = await openChannelFee({
        amountMsat: props.sendingAmount,
      });

      if (props.sendingAmount === 0) {
        setGeneratingQrCode(false);
        setErrorMessageText('Must recieve more than 0 sats');
        return;
      } else if (props.sendingAmount < channelFee.feeMsat) {
        setGeneratingQrCode(false);
        setErrorMessageText('Channel Open Fee is 3,000 sat');
        return;
      }
      setErrorMessageText('');
      setGeneratingQrCode(true);
      const invoice = await receivePayment({
        amountMsat: props.sendingAmount,
        description: props.paymentDescription,
      });
      console.log(invoice);
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: SIZES.large,
    fontFamily: FONT.Descriptoin_Regular,
  },
});
