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
import crypto from 'react-native-quick-crypto';
import {randomUUID} from 'expo-crypto';
import {getLocalStorageItem, setLocalStorageItem} from '../../../../functions';
import {removeLocalStorageItem} from '../../../../functions/localStorage';

export default function ReceievePage(props) {
  const fadeAnim = useRef(new Animated.Value(900)).current;
  const [numReceived, setNumReceived] = useState(0);
  const [receiveAddress, setReceiveAddress] = useState('');
  const [isGeneratinAddress, setIsGeneratingAddress] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

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
      const UUID = randomUUID();
      const invoice = await receivePayment({
        amountMsat: props.amountPerPerson * 1000,
        description: `bwrfd ${UUID}`,
      });
      //   BWRFD = Blitz Wallet Receive Faucet Data
      //   removeLocalStorageItem('faucet');
      const localStorageItem = await getLocalStorageItem('faucet');
      if (!localStorageItem) {
        setLocalStorageItem('faucet', JSON.stringify([UUID]));
      } else {
        const tempArr = JSON.parse(localStorageItem);
        tempArr.push(UUID);
        setLocalStorageItem('faucet', JSON.stringify([...tempArr]));
      }
      console.log(localStorageItem);

      setReceiveAddress(invoice.lnInvoice.bolt11);
      setIsGeneratingAddress(false);
      // console.log(invoice);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    console.log(props.breezEvent?.details, 'BREEZ EVENT IN RECIVE FAUCET');
    (async () => {
      if (!props.breezEvent?.details?.payment?.description?.includes('bwrfd'))
        return;
      const faucetItemsList = await getLocalStorageItem('faucet');
      const description =
        props.breezEvent?.details?.payment?.description.split(' ')[1];

      if (faucetItemsList?.includes(description)) {
        if (numReceived + 1 >= props.numberOfPeople) {
          setIsComplete(true);
          setNumReceived(prev => (prev += 1));
          //   NEED TO CLEAR faucet local storage
          // reset page to normal page
          return;
        }
        setNumReceived(prev => (prev += 1));
        generateAddress();
      }
    })();
  }, [props.breezEvent]);

  useEffect(() => {
    if (props.isDisplayed) {
      fadeIn();
      generateAddress();
    } else fadeOut();
  }, [props.isDisplayed]);

  function clear() {
    setNumReceived(0);
    setReceiveAddress('');
    props.setRecievePath({
      settings: false,
      mainPage: false,
    });
    props.setNumberOfPeople('');
    props.setAmountPerPerson('');
    props.setFaucet(false);
    removeLocalStorageItem('faucet');
  }
  return (
    <Animated.View
      style={[styles.popupContainer, {transform: [{translateX: fadeAnim}]}]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topBar}>
          {!isComplete && (
            <TouchableOpacity
              onPress={() =>
                props.setRecievePath(prev => {
                  return {...prev, mainPage: false};
                })
              }>
              <Image style={backArrow} source={ICONS.leftCheveronIcon} />
            </TouchableOpacity>
          )}
          <Text
            style={[
              headerText,
              {transform: [{translateX: !isComplete ? -12.5 : 0}]},
            ]}>
            Receive Faucet
          </Text>
        </View>
        <View style={styles.contentContainer}>
          {!isComplete && (
            <>
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
                style={[
                  styles.recivedAmount,
                  {color: isComplete ? 'green' : 'red'},
                ]}>{`${numReceived}/${props.numberOfPeople}`}</Text>
            </>
          )}
          {/* 
          Num recived out of total recived
          QR code to be scanned 
           */}
          {isComplete && (
            <View style={styles.completedContainer}>
              <Image style={styles.confirmIcon} source={ICONS.Checkcircle} />
              <Text style={styles.completedText}>Completed</Text>
              <View style={{alignItems: 'center', flex: 1}}>
                <Text style={styles.youRecievedHeader}>You Receieved</Text>
                <Text style={[styles.recivedAmount, {marginBottom: 'auto'}]}>
                  {(
                    props.numberOfPeople * props.amountPerPerson
                  ).toLocaleString()}{' '}
                  sats
                </Text>
                <TouchableOpacity
                  onPress={clear}
                  style={[styles.button, {backgroundColor: COLORS.primary}]}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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

  //   confirmed
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmIcon: {
    width: 150,
    height: 150,
    marginBottom: 10,
    marginTop: 50,
  },
  completedText: {
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.xLarge,
    marginBottom: 'auto',
  },
  youRecievedHeader: {
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.large,
    marginTop: 'auto',
  },
  button: {
    width: 150,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 50,
  },
  buttonText: {color: COLORS.white, fontFamily: FONT.Other_Regular},
});
