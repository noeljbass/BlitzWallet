import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../../constants';

import {useEffect, useRef, useState} from 'react';
import {
  ReportIssueRequestVariant,
  fetchFiatRates,
  nodeInfo,
  parseInput,
  reportIssue,
  sendPayment,
} from '@breeztech/react-native-breez-sdk';
import {getLocalStorageItem} from '../../../../functions';
import {useNavigation} from '@react-navigation/native';
import {useGlobalContextProvider} from '../../../../../context-store/context';

export default function SendPaymentScreen(props) {
  console.log('CONFIRM SEND PAYMENT SCREEN');
  const [paymentInfo, setPaymentInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userSelectedCurrency, setUserSelectedCurrency] = useState('');
  const [sendingAmount, setSendingAmount] = useState(0);
  const {theme, nodeInformation} = useGlobalContextProvider();
  const navigate = useNavigation();
  const BTCadress = props.route.params?.btcAdress;
  const setScanned = props.route.params?.setDidScan;

  useEffect(() => {
    decodeLNAdress();
  }, []);

  return (
    <View
      style={[
        styles.popupContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
          paddingTop: Platform.OS === 'ios' ? 0 : 10,
        },
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{flex: 1, position: 'relative'}}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => goBackFunction()}>
                <Image
                  style={styles.backButton}
                  source={ICONS.leftCheveronIcon}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.headerText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                Confirm Payment
              </Text>
            </View>
            {!isLoading && (
              <>
                <View style={styles.innerContainer}>
                  {paymentInfo.invoice.amountMsat ? (
                    <Text
                      style={[
                        styles.sendingAmtBTC,
                        {
                          color: theme
                            ? COLORS.darkModeText
                            : COLORS.lightModeText,
                        },
                      ]}>
                      {(
                        paymentInfo?.invoice?.amountMsat / 1000
                      ).toLocaleString()}{' '}
                      <Text style={{color: COLORS.primary}}>sat</Text>
                    </Text>
                  ) : (
                    <View style={styles.sendingAmountInputContainer}>
                      <TextInput
                        style={[
                          styles.sendingAmtBTC,
                          {
                            color: theme
                              ? COLORS.darkModeText
                              : COLORS.lightModeText,
                            marginTop: 0,
                          },
                        ]}
                        placeholderTextColor={
                          theme ? COLORS.darkModeText : COLORS.lightModeText
                        }
                        // value={String(sendingAmount / 1000)}
                        keyboardType="number-pad"
                        placeholder="0"
                        onChangeText={e => {
                          if (isNaN(e)) return;
                          setSendingAmount(Number(e) * 1000);
                        }}
                      />

                      <Text
                        style={[
                          styles.sendingAmtBTC,
                          {
                            color: COLORS.primary,
                            marginTop: 0,
                          },
                        ]}>
                        {' '}
                        sat
                      </Text>
                    </View>
                  )}
                  <View style={styles.feeBreakdownContainer}>
                    <View style={styles.feeBreakdownRow}>
                      <Text
                        style={[
                          styles.feeBreakdownItem,
                          {
                            color: theme
                              ? COLORS.darkModeText
                              : COLORS.lightModeText,
                          },
                        ]}>
                        Amount
                      </Text>
                      <View
                        style={[
                          styles.feeBreakdownItem,
                          {
                            color: theme
                              ? COLORS.darkModeText
                              : COLORS.lightModeText,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.feeBreakdownValue,
                            {
                              color: theme
                                ? COLORS.darkModeText
                                : COLORS.lightModeText,
                            },
                          ]}>
                          {(
                            (paymentInfo?.invoice?.amountMsat
                              ? paymentInfo?.invoice?.amountMsat
                              : sendingAmount) / 1000
                          ).toLocaleString()}{' '}
                          sat
                        </Text>
                        <Text
                          style={[
                            styles.feeBreakdownValue,
                            {
                              color: theme
                                ? COLORS.darkModeText
                                : COLORS.lightModeText,
                            },
                          ]}>
                          {(
                            ((paymentInfo?.invoice?.amountMsat
                              ? paymentInfo?.invoice?.amountMsat
                              : sendingAmount) /
                              1000) *
                            (paymentInfo[0]?.value / 100000000)
                          ).toLocaleString()}{' '}
                          {userSelectedCurrency}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.feeBreakdownRow}>
                      <Text
                        style={[
                          styles.feeBreakdownItem,
                          {
                            color: theme
                              ? COLORS.darkModeText
                              : COLORS.lightModeText,
                          },
                        ]}>
                        Blitz Fee
                      </Text>
                      <View
                        style={[
                          styles.feeBreakdownItem,
                          {
                            color: theme
                              ? COLORS.darkModeText
                              : COLORS.lightModeText,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.feeBreakdownValue,
                            {
                              color: theme
                                ? COLORS.darkModeText
                                : COLORS.lightModeText,
                            },
                          ]}>
                          {0} sat
                        </Text>
                        <Text
                          style={[
                            styles.feeBreakdownValue,
                            {
                              color: theme
                                ? COLORS.darkModeText
                                : COLORS.lightModeText,
                            },
                          ]}>
                          0.00 {userSelectedCurrency}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.feeBreakdownRow}>
                      <Text
                        style={[
                          styles.feeBreakdownItem,
                          {
                            color: theme
                              ? COLORS.darkModeText
                              : COLORS.lightModeText,
                          },
                        ]}>
                        Total
                      </Text>
                      <View
                        style={[
                          styles.feeBreakdownItem,
                          {
                            color: theme
                              ? COLORS.darkModeText
                              : COLORS.lightModeText,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.feeBreakdownValue,
                            {
                              color: theme
                                ? COLORS.darkModeText
                                : COLORS.lightModeText,
                            },
                          ]}>
                          {(
                            (paymentInfo?.invoice?.amountMsat
                              ? paymentInfo?.invoice?.amountMsat
                              : sendingAmount) / 1000
                          ).toLocaleString()}{' '}
                          sat
                        </Text>
                        <Text
                          style={[
                            styles.feeBreakdownValue,
                            {
                              color: theme
                                ? COLORS.darkModeText
                                : COLORS.lightModeText,
                            },
                          ]}>
                          {(
                            ((paymentInfo?.invoice?.amountMsat
                              ? paymentInfo?.invoice?.amountMsat
                              : sendingAmount) /
                              1000) *
                            (paymentInfo[0]?.value / 100000000)
                          ).toLocaleString()}{' '}
                          {userSelectedCurrency}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* Buttons */}
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      activeOpacity={0.3}
                      onPress={() => {
                        goBackFunction();
                      }}
                      style={[
                        styles.button,
                        {backgroundColor: COLORS.cancelRed},
                      ]}>
                      <Text style={styles.buttonText}>cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={!sendingAmount ? 0.5 : 0.3}
                      onPress={() => {
                        if (!sendingAmount) return;
                        sendPaymentFunction();
                      }}
                      style={[
                        styles.button,
                        {
                          backgroundColor: COLORS.primary,
                          opacity: !sendingAmount ? 0.5 : 1,
                        },
                      ]}>
                      <Text style={styles.buttonText}>send</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            {isLoading && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator
                  size="large"
                  color={theme ? COLORS.darkModeText : COLORS.lightModeText}
                />
              </View>
            )}
            {/* popups */}
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );

  async function sendPaymentFunction() {
    try {
      setIsLoading(true);
      paymentInfo?.invoice?.amountMsat
        ? await sendPayment({
            bolt11: paymentInfo?.invoice?.bolt11,
          })
        : await sendPayment({
            bolt11: paymentInfo?.invoice?.bolt11,
            amountMsat: Number(sendingAmount),
          });
      // if (response) {
      //   // goBackFunction();
      //   //
      //   // goBackFunction();
      // }
    } catch (err) {
      try {
        const paymentHash = paymentInfo.invoice.paymentHash;
        await reportIssue({
          type: ReportIssueRequestVariant.PAYMENT_FAILURE,
          data: {paymentHash},
        });
      } catch (err) {
        console.log(err, 'T');
      }
    }
  }

  async function decodeLNAdress() {
    setIsLoading(true);
    // try {
    if (nodeInformation.didConnectToNode) {
      try {
        const input = await parseInput(BTCadress);
        const currency = await getLocalStorageItem('currency');

        const bitcoinPrice = (await fetchFiatRates()).filter(
          coin => coin.coin === currency,
        );

        if (
          nodeInformation.userBalance * 1000 + 100 <
          input.invoice.amountMsat
        ) {
          Alert.alert(
            'Your balance is too low to send this payment',
            'Please add funds to your account',
            [{text: 'Ok', onPress: () => goBackFunction()}],
          );
          return;
        }

        setPaymentInfo({...input, ...bitcoinPrice});
        setUserSelectedCurrency(currency);
        setSendingAmount(input.invoice.amountMsat);
        setIsLoading(false);
      } catch (err) {
        Alert.alert(
          'Not a valid LN Address',
          'Please try again with a bolt 11 address',
          [{text: 'Ok', onPress: () => goBackFunction()}],
        );
        console.log(err);
      }
    } else {
      Alert.alert('Error not connected to node', '', [
        {text: 'Ok', onPress: () => goBackFunction()},
      ]);
    }
  }

  function goBackFunction() {
    navigate.goBack();
    setScanned(false);
  }
}

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
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
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginRight: 'auto',
    marginLeft: 'auto',
    fontFamily: FONT.Title_Bold,

    transform: [{translateX: -15}],
  },
  sendingAmountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  sendingAmtBTC: {
    fontSize: SIZES.xxLarge,
    marginBottom: 90,
    marginTop: 'auto',
    fontFamily: FONT.Title_Regular,
  },
  feeBreakdownContainer: {
    width: '85%',
  },
  feeBreakdownRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
  },
  feeBreakdownItem: {
    width: '36%',
    textAlign: 'right',

    alignItems: 'flex-end',
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Bold,
  },
  feeBreakdownValue: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
  },

  buttonsContainer: {
    width: '90%',
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    fontFamily: FONT.Other_Regular,
  },
});
