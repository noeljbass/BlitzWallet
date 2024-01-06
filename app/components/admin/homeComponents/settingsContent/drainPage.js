import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import {BTN, COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../../constants';
import {useEffect, useRef, useState} from 'react';
import {fetchFiatRates} from '@breeztech/react-native-breez-sdk';
import {getLocalStorageItem} from '../../../../functions';
import {useTheme} from '../../../../../context-store/context';
import {useNavigation} from '@react-navigation/native';
// TEXT INPUT CAUSES LAUNCH SCREEN TO FAIL
export default function DrainPage(props) {
  const isInitialRender = useRef(true);
  const [wantsToDrain, setWantsToDrain] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [fiatRate, setFiatRate] = useState(0);
  const {theme, toggleTheme} = useTheme();
  const navigate = useNavigation();
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  console.log(props);

  useEffect(() => {
    if (isInitialRender.current) {
      getFiatConversion();
      isInitialRender.current = false;
    }
    if (!wantsToDrain) return;

    Alert.alert('This function does not work yet', '', [
      {text: 'Ok', onPress: () => navigate.goBack()},
    ]);

    // console.log('DRAINING WALLET');
  }, [wantsToDrain]);

  return (
    <View style={styles.globalContainer}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={{flex: 1}}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <View style={styles.balanceContainer}>
                <Text
                  style={[
                    styles.balanceDescription,
                    {
                      color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    },
                  ]}>
                  Current balance
                </Text>
                <Text
                  style={[
                    styles.balanceNum,
                    {
                      color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    },
                  ]}>
                  {Math.floor(props.breezInformation?.userBalance)
                    .toLocaleString()
                    .toLocaleString()}{' '}
                  sats
                </Text>
                <Text
                  style={[
                    styles.fiatBalanceNum,
                    {
                      color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    },
                  ]}>
                  = $
                  {props.breezInformation?.userBalance *
                    (fiatRate / 100000000).toFixed(5)}{' '}
                  usd
                </Text>
              </View>

              <View
                style={[
                  styles.btcAdressContainer,
                  {
                    backgroundColor: theme
                      ? COLORS.darkModeBackgroundOffset
                      : COLORS.lightModeBackgroundOffset,
                    marginBottom: 'auto',
                  },
                ]}>
                <Text
                  style={[
                    styles.btcAdressHeader,
                    {
                      color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    },
                  ]}>
                  Enter BTC address
                </Text>
                <View style={[styles.inputContainer]}>
                  <TextInput
                    value={bitcoinAddress}
                    onChangeText={setBitcoinAddress}
                    style={[
                      styles.input,
                      {
                        borderColor: theme
                          ? COLORS.darkModeText
                          : COLORS.lightModeText,
                        color: theme
                          ? COLORS.darkModeText
                          : COLORS.lightModeText,
                      },
                    ]}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      navigate.navigate('DrainWalletAddress', {
                        updateBitcoinAdressFunc: setBitcoinAddress,
                      });
                    }}>
                    <Image style={styles.scanIcon} source={ICONS.faceIDIcon} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (!bitcoinAddress) return;
                  navigate.navigate('ConfirmDrainPage', {
                    wantsToDrainFunc: setWantsToDrain,
                  });
                }}
                style={[
                  BTN,
                  {
                    backgroundColor: COLORS.primary,
                    opacity: !bitcoinAddress ? 0.5 : 1,

                    marginBottom: 80,
                  },
                ]}>
                <Text style={styles.buttonText}>Drain</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );

  async function getFiatConversion() {
    try {
      const userSelectedFiat = await getLocalStorageItem('currency');
      const fiat = await fetchFiatRates();
      const [fiatRate] = fiat.filter(rate => {
        return rate.coin.toLowerCase() === userSelectedFiat.toLowerCase();
      });
      if (!fiatRate) return;
      setFiatRate(fiatRate.value);
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    alignItems: 'center',
  },

  balanceContainer: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 50,
  },
  balanceNum: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.xxLarge,
  },
  fiatBalanceNum: {
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.medium,
  },
  balanceDescription: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },

  btcAdressContainer: {
    width: '90%',
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.offsetBackground,
  },
  btcAdressHeader: {
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },

  inputContainer: {
    width: '100%',
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: '80%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 2,
    paddingHorizontal: 10,
  },
  scanIcon: {
    width: 35,
    height: 35,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontFamily: FONT.Other_Regular,
  },
});
