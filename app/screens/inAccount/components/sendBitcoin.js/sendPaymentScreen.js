import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';
import {
  BTN,
  CENTER,
  COLORS,
  ICONS,
  SHADOWS,
  SIZES,
} from '../../../../constants';

import {useEffect, useRef, useState} from 'react';
import {
  InputTypeVariant,
  fetchFiatRates,
  listFiatCurrencies,
  parseInput,
  sendPayment,
} from '@breeztech/react-native-breez-sdk';
import ConfirmPaymentScreen from './confirmPaymentScreen';

export default function SendPaymentScreen(props) {
  const fadeAnim = useRef(new Animated.Value(900)).current;
  const [confirmPayment, setConfirmPayment] = useState({
    isDisplayed: false,
    information: {},
  });
  const [paymentInfo, setPaymentInfo] = useState({});

  function clear() {
    props.setScanned(false);
    setConfirmPayment({
      isDisplayed: false,
      information: {},
    });
    props.setSendPayment(false);
  }

  async function sendPaymentFunction() {
    try {
      console.log('pressed');
      const response = await sendPayment({
        bolt11: paymentInfo?.invoice?.bolt11,
        // amountMsat: paymentInfo?.invoice?.amountMsat
        //   ? paymentInfo?.invoice?.amountMsat
        //   : null,
      });
      if (response) {
        setConfirmPayment({
          isDisplayed: true,
          information: response?.payment,
        });
      }
      console.log(response, 'SEND PAYMENT RESPONSE');
    } catch (err) {
      console.log(err);
    }
  }

  async function decodeLNAdress() {
    try {
      const input = await parseInput(props.BTCadress);
      const bitcoinPrice = (await fetchFiatRates()).filter(
        coin => coin.coin === 'USD',
      );

      setPaymentInfo({...input, ...bitcoinPrice});
    } catch (err) {
      console.log(err);
    }
  }

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
      decodeLNAdress();
      fadeIn();
    } else fadeOut();
  }, [props.isDisplayed]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}>
      <View style={styles.popupContainer}>
        <SafeAreaView style={{flex: 1, position: 'relative'}}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => props.setScanned(false)}>
              <Image
                style={styles.backButton}
                source={ICONS.leftCheveronIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Confirm Payment</Text>
          </View>
          <View style={styles.innerContainer}>
            <Text style={styles.sendingAmtBTC}>
              {(paymentInfo?.invoice?.amountMsat / 1000).toLocaleString()}{' '}
              <Text style={{color: COLORS.primary}}>sat</Text>
            </Text>
            <View style={styles.feeBreakdownContainer}>
              <View style={styles.feeBreakdownRow}>
                <Text style={[styles.feeBreakdownItem]}>Amount</Text>
                <View style={[styles.feeBreakdownItem]}>
                  <Text>
                    {(paymentInfo?.invoice?.amountMsat / 1000).toLocaleString()}{' '}
                    sat
                  </Text>
                  <Text>
                    {(
                      (paymentInfo?.invoice?.amountMsat / 1000) *
                      (paymentInfo[0]?.value / 100000000)
                    ).toLocaleString()}{' '}
                    usd
                  </Text>
                </View>
              </View>
              <View style={styles.feeBreakdownRow}>
                <Text style={[styles.feeBreakdownItem]}>Lightning Fee</Text>
                <View style={[styles.feeBreakdownItem]}>
                  <Text>{0} sat</Text>
                  <Text>0.00 usd</Text>
                </View>
              </View>
              <View style={styles.feeBreakdownRow}>
                <Text style={[styles.feeBreakdownItem]}>Total</Text>
                <View style={[styles.feeBreakdownItem]}>
                  <Text>
                    {(
                      paymentInfo?.invoice?.amountMsat / 1000 +
                      0
                    ).toLocaleString()}{' '}
                    sat
                  </Text>
                  <Text>
                    {(
                      (paymentInfo?.invoice?.amountMsat / 1000 + 0) *
                      (paymentInfo[0]?.value / 100000000)
                    ).toLocaleString()}{' '}
                    usd
                  </Text>
                </View>
              </View>
            </View>
            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => props.setScanned(false)}
                style={[styles.button, {backgroundColor: COLORS.cancelRed}]}>
                <Text style={styles.buttonText}>cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={sendPaymentFunction}
                style={[styles.button, {backgroundColor: COLORS.primary}]}>
                <Text style={styles.buttonText}>send</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* popups */}
          <ConfirmPaymentScreen clear={clear} {...confirmPayment} />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  innerContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 20,
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 30,
    height: 30,
  },
  headerText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginRight: 'auto',
    marginLeft: 'auto',

    transform: [{translateX: -15}],
  },
  sendingAmtBTC: {
    fontSize: SIZES.xxLarge,
    marginBottom: 90,
    marginTop: 'auto',
  },
  feeBreakdownContainer: {
    width: '75%',
  },
  feeBreakdownRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
  },
  feeBreakdownItem: {
    width: '33%',
    textAlign: 'right',

    alignItems: 'flex-end',
  },

  buttonsContainer: {
    width: '90%',
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',

    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    borderRadius: 5,
    ...SHADOWS.small,
  },
  buttonText: {
    fontSize: SIZES.medium,
    color: COLORS.lightWhite,
  },
});
