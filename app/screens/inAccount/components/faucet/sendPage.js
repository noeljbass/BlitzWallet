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

export default function SendPage(props) {
  const fadeAnim = useRef(new Animated.Value(900)).current;
  const [numSent, setNumSent] = useState(0);
  const [sendAddress, setSendAddress] = useState('');
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

  useEffect(() => {
    if (props.isDisplayed) {
      fadeIn();
    } else fadeOut();
  }, [props.isDisplayed]);

  function clear() {
    setNumSent(0);
    setSendAddress('');
    props.setUserPath({
      settings: false,
      sent: false,
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
                props.setUserPath(prev => {
                  return {...prev, send: false};
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
            Send Faucet
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
                    value={sendAddress ? sendAddress : "IT'S COMING"}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.sentAmount,
                  {color: isComplete ? 'green' : 'red'},
                ]}>{`${numSent}/${props.numberOfPeople}`}</Text>
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
                <Text style={styles.youSentHeader}>You Sent</Text>
                <Text style={[styles.sentAmount, {marginBottom: 'auto'}]}>
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
  sentAmount: {
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
  youSentHeader: {
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
