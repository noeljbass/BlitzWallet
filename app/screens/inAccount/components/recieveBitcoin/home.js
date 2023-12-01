import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  BTN,
  CENTER,
  COLORS,
  FONT,
  ICONS,
  SIZES,
  SHADOWS,
} from '../../../../constants';

import QRCode from 'react-native-qrcode-svg';
import {useEffect, useRef, useState} from 'react';
// import {
//   getLocalStorageItem,
//   setLocalStorageItem,
// } from '../../../global/localStorage';

import * as Clipboard from 'expo-clipboard';

import * as Device from 'expo-device';
import {getLocalStorageItem, retrieveData} from '../../../../functions';

import {getFiatRates} from '../../../../functions/SDK';
import EditAmountPopup from './editAmount';
import {
  listLsps,
  lspId,
  lspInfo,
  openChannelFee,
  receivePayment,
} from '@breeztech/react-native-breez-sdk';
import ConfirmPaymentScreen from './confirmPaymentScreen';

export function ReceivePaymentHome(props) {
  const isInitialRender = useRef(true);
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [fiatRate, setFiatRate] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sendingAmount, setSendingAmount] = useState(1000);
  const [paymentDescription, setPaymentDescription] = useState('');
  const [generatingQrCode, setGeneratingQrCode] = useState(false);
  const [editPaymentPopup, setEditPaymentPopup] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');
  const [updateQRCode, setUpdateQRCode] = useState(0);

  const deviceType = Device.brand;

  function clear() {
    setSendingAmount(1000);
    setPaymentDescription('');
    setShowConfirmation(false);
    setEditPaymentPopup(false);
    props.setRecivePayment(false);
    setErrorMessageText('');
  }

  async function copyToClipboard() {
    await Clipboard.setStringAsync(generatedAddress);
    window.alert('Text Copied to Clipboard');
  }

  async function openShareOptions() {
    try {
      await Share.share({
        message: generatedAddress,
      });
    } catch {
      window.alert('ERROR with sharing');
    }
  }

  async function generateLightningInvoice() {
    try {
      const channelFee = await openChannelFee({
        amountMsat: sendingAmount,
      });

      if (sendingAmount === 0) {
        setGeneratingQrCode(false);
        setErrorMessageText('Must recieve more than 0 sats');
        return;
      } else if (sendingAmount < channelFee.feeMsat) {
        setGeneratingQrCode(false);
        setErrorMessageText('Channel Open Fee is 3,000 sat');
        return;
      }
      setErrorMessageText('');
      setGeneratingQrCode(true);
      const invoice = await receivePayment({
        amountMsat: sendingAmount,
        description: paymentDescription,
      });
      if (invoice) setGeneratingQrCode(false);
      setGeneratedAddress(invoice.lnInvoice.bolt11);
    } catch (err) {
      console.log(err, 'RECIVE ERROR');
    }
  }

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const newDate = new Date();
    const lastTransaction = new Date(
      props.breezInformation?.transactions[0]?.paymentTime * 1000,
    );

    if (Math.abs(newDate - lastTransaction) >= 30 * 1000) return;

    console.log('SUCCESFULL');
    setShowConfirmation(true);
  }, [props.breezInformation?.transactions]);

  useEffect(() => {
    if (props.isDisplayed === false) return;
    generateLightningInvoice();

    (async () => {
      const fiatRates = await getFiatRates();
      const [selectedPrice] = fiatRates.filter(rate => rate.coin === 'USD');
      setFiatRate(selectedPrice.value);
    })();
  }, [props.isDisplayed, updateQRCode]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}>
      <View
        style={[
          {paddingTop: deviceType.toLocaleLowerCase() === 'apple' ? 55 : 0},
          styles.globalContainer,
        ]}>
        <View style={styles.topbar}>
          <TouchableOpacity activeOpacity={1} onPress={clear}>
            <Image
              source={ICONS.leftCheveronIcon}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.navText}>Receive</Text>
        </View>
        <Text style={styles.title}>Lightning</Text>
        <View style={styles.qrcodeContainer}>
          {generatingQrCode && (
            <ActivityIndicator size="large" color={COLORS.primary} />
          )}
          {!generatingQrCode && !errorMessageText && (
            <QRCode
              size={250}
              value={generatedAddress ? generatedAddress : 'Random Input Data'}
            />
          )}
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.valueAmountText}>
            {(sendingAmount / 1000).toLocaleString()} sat /{' '}
            {((fiatRate / 100000000) * (sendingAmount / 1000)).toFixed(2)}{' '}
            {'USD'}
          </Text>
          <Text>
            {paymentDescription ? paymentDescription : 'no description'}
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessageText}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={openShareOptions}
            style={[styles.buttonsOpacity]}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={copyToClipboard}
            style={[styles.buttonsOpacity]}>
            <Text style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEditPaymentPopup(true)}
            style={[styles.buttonsOpacity]}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* popups */}
        {/* <FullAdress
          isDisplayed={fullAddressView}
          setDisplayAdress={setFullAddressView}
          address={generatedAddress}
        /> */}
      </View>
      <EditAmountPopup
        setSendingAmount={setSendingAmount}
        setPaymentDescription={setPaymentDescription}
        isDisplayed={editPaymentPopup}
        setIsDisplayed={setEditPaymentPopup}
        setUpdateQRCode={setUpdateQRCode}
      />
      <ConfirmPaymentScreen
        isDisplayed={showConfirmation}
        transactions={props.transactions}
        breezInformation={props.breezInformation}
        clear={clear}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    height: '100%',
    width: '100%',
    flex: 1,

    backgroundColor: COLORS.background,

    position: 'relative',
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    ...CENTER,
    transform: [{translateX: -15}],
  },
  title: {
    ...CENTER,
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.xLarge,
    marginBottom: 20,
  },
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
  },

  buttonsContainer: {
    width: '90%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...CENTER,
    marginTop: 'auto',
    marginBottom: 40,
  },
  buttonsOpacity: {
    height: '100%',
    width: 100,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    // overflow: "hidden",
    ...SHADOWS.medium,
  },
  buttonText: {
    fontFamily: FONT.Other_Regular,
    fontSize: SIZES.medium,
    color: COLORS.background,
  },
});
