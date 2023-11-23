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
import {useEffect, useState} from 'react';
// import {
//   getLocalStorageItem,
//   setLocalStorageItem,
// } from '../../../global/localStorage';

// import * as Clipboard from 'expo-clipboard';
// import {FullAdress} from './fullAddress';
// import * as Device from 'expo-device';
import {getLocalStorageItem, retrieveData} from '../../../../functions';
import {receivePayment} from '@breeztech/react-native-breez-sdk';

// import * as Sharing from "expo-sharing";

export function ReceivePaymentHome(props) {
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [fullAddressView, setFullAddressView] = useState(false);
  const [sendingAmount, setSendingAmount] = useState(3000000);
  const [paymentDescription, setPaymentDescription] = useState('');
  const [generatingQrCode, setGeneratingQrCode] = useState(false);
  const [editPaymentPopup, setEditPaymentPopup] = useState(false);
  //   const canShare = Sharing.isAvailableAsync()["_j"];
  //   const deviceType = Device.brand;

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
      setGeneratingQrCode(true);
      //   const invoice = await receivePayment({
      //     amountMsat: sendingAmount,
      //     description: paymentDescription,
      //   });
      //   if (invoice) setGeneratingQrCode(false);
      //   setGeneratedAddress(invoice.lnInvoice.bolt11);
      setGeneratingQrCode(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (props.isDisplayed === false) return;
    generateLightningInvoice();
  }, [props.isDisplayed]);
  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}>
      <View
        style={[
          {paddingTop: 'deviceType' === 'deviceType' ? 55 : 0},
          styles.globalContainer,
        ]}>
        <View style={styles.topbar}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              props.setRecivePayment(false);
            }}>
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
          {!generatingQrCode && (
            <QRCode
              size={250}
              value={generatedAddress ? generatedAddress : 'TESTING'}
            />
          )}
        </View>
        <View style={styles.amountContainer}>
          <Text>{sendingAmount / 1000}sat</Text>
          <Text>
            {paymentDescription ? paymentDescription : 'no description'}
          </Text>
        </View>
        {/* <View
          onTouchEnd={() => setFullAddressView(true)}
          style={styles.bitcoinAddressContainer}>
          <Text style={styles.generatedBTCaddress}>
            {generatedAddress.slice(0, 32) + '...'}
          </Text>
          <Image
            source={ICONS.EyeIcon}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </View> */}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    height: '100%',
    width: '100%',
    flex: 1,

    backgroundColor: COLORS.background,
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

  //

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
