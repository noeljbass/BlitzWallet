import {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../../constants';
import {BTN, backArrow, headerText} from '../../../../constants/styles';
import QRCode from 'react-native-qrcode-svg';
import {receivePayment} from '@breeztech/react-native-breez-sdk';

export default function ReceievePage(props) {
  const fadeAnim = useRef(new Animated.Value(900)).current;
  const [numReceived, setNumReceived] = useState(0);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [isGeneratinAddress, setIsGeneratingAddress] = useState(true);

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
  function fadeOut() {
    Animated.timing(fadeAnim, {
      toValue: 900,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  async function generateAddress() {
    setIsGeneratingAddress(true);
    try {
      const invoice = await receivePayment({
        amountMsat: props.amountPerPerson * 1000,
        description: `Receive faucet for ${props.amountPerPerson
          .toString()
          .toLocaleString()} sats`,
      });
      setReceiveAddress(invoice.lnInvoice.bolt11);
      setIsGeneratingAddress(false);
      console.log(invoice);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (props.isDisplayed) {
      fadeIn();
      generateAddress();
    } else fadeOut();
  }, [props.isDisplayed]);
  return (
    <Animated.View
      style={[styles.popupContainer, {transform: [{translateX: fadeAnim}]}]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() =>
              props.setRecievePath(prev => {
                return {...prev, mainPage: false};
              })
            }>
            <Image style={backArrow} source={ICONS.leftCheveronIcon} />
          </TouchableOpacity>
          <Text style={[headerText, {transform: [{translateX: -12.5}]}]}>
            Receive Faucet
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.qrCodeContainer}>
            {isGeneratinAddress && (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
            {!isGeneratinAddress && (
              <QRCode
                size={250}
                value={receiveAddress ? receiveAddress : "IT'S COMING"}
              />
            )}
          </View>
          <Text
            style={
              styles.recivedAmount
            }>{`${numReceived}/${props.numberOfPeople}`}</Text>
          {/* 
          Num recived out of total recived
          QR code to be scanned 
           */}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.background,
    position: 'absolute',
  },

  topBar: {
    flexDirection: 'row',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeContainer: {
    width: '90%',
    maxWidth: 250,
    height: 250,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recivedAmount: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Bold,
  },
});
