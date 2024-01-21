import {useNavigation} from '@react-navigation/native';
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
} from 'react-native';

import {BTN, CENTER, COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import {useGlobalContextProvider} from '../../../../../context-store/context';
import {useEffect, useState} from 'react';
import {getLocalStorageItem, setLocalStorageItem} from '../../../../functions';
import {getFiatRates} from '../../../../functions/SDK';

export default function AmountToGift() {
  const navigate = useNavigation();
  const {theme} = useGlobalContextProvider();

  const [enteredSatAmount, setEnteredSatAmount] = useState(0);
  const [currencyInfo, setCurrencyInfo] = useState({
    currency: '',
    value: 0,
  });

  useEffect(() => {
    getUserSelectedCurrency();
  }, []);
  return (
    <View
      style={[
        styles.globalContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
          paddingVertical: Platform.OS === 'ios' ? 0 : 10,
        },
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.topbar}>
              <TouchableOpacity
                onPress={() => {
                  navigate.goBack();
                }}>
                <Image
                  style={styles.topBarIcon}
                  source={ICONS.leftCheveronIcon}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.topBarText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                Set Amount
              </Text>
            </View>
            <Text
              style={[
                styles.topBarText,
                {fontWeight: 'normal', fontSize: SIZES.medium, marginTop: 10},
              ]}>
              How much would you like to load?
            </Text>

            <View style={[styles.contentContainer]}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.sendingAmtBTC,
                    {
                      color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                      marginTop: 0,
                    },
                  ]}
                  // value={String(sendingAmount / 1000)}
                  keyboardType="numeric"
                  placeholder="0"
                  onChangeText={e => {
                    if (isNaN(e)) return;
                    setEnteredSatAmount(Number(e) * 1000);
                  }}
                />
                <Text style={styles.satText}>Sat</Text>
              </View>
              <View>
                <Text>
                  = {10} {currencyInfo.currency}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigate.navigate('AmountToGift');
                return;
                Alert.alert('This does not work yet');
              }}
              style={[
                BTN,
                {
                  backgroundColor: COLORS.primary,
                  marginTop: 'auto',
                  marginBottom: 0,
                  ...CENTER,
                },
              ]}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
  async function getUserSelectedCurrency() {
    try {
      const currency = await getLocalStorageItem('currency');
      if (!currency) setLocalStorageItem('currency', 'USD');
      const value = await getFiatRates();
      console.log(value);
      setCurrencyInfo({currency: currency});
    } catch (err) {}
  }
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarIcon: {
    width: 25,
    height: 25,
  },
  topBarText: {
    fontSize: SIZES.large,
    marginRight: 'auto',
    marginLeft: 'auto',
    transform: [{translateX: -12.5}],
    fontFamily: FONT.Title_Bold,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentItem: {
    width: '90%',
    marginVertical: 10,
  },
  contentHeader: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
  contentDescriptionContainer: {
    padding: 10,
    borderRadius: 8,
  },
  contentDescription: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },

  inputContainer: {flexDirection: 'row', alignItems: 'baseline'},

  sendingAmtBTC: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.Title_Regular,
  },

  satText: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Regular,
    color: COLORS.primary,
    marginLeft: 10,
  },

  buttonText: {
    color: COLORS.white,
    fontFamily: FONT.Other_Regular,
  },
});
