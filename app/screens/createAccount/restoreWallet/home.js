import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Back_BTN} from '../../../components/login';
import {storeData} from '../../../functions';
import {BTN, CENTER, COLORS, FONT, SIZES} from '../../../constants';
import {useState} from 'react';
import isValidMnemonic from '../../../functions/isValidMnemonic';
const NUMKEYS = Array.from(new Array(12), (val, index) => index + 1);
export default function RestoreWallet({navigation: {navigate}}) {
  // navigate('DisclaimerPage');

  // function login() {
  //   storeData(
  //     'mnemonic',
  //     'enroll common snap embody ritual element exhaust start glove safe grunt quantum',
  //   );
  //   storeData('pin', JSON.stringify([1, 2, 3, 4]));
  //   navigate('HomeAdmin');

  // }
  const [key, setKey] = useState({
    key1: null,
    key2: null,
    key3: null,
    key4: null,
    key5: null,
    key6: null,
    key7: null,
    key8: null,
    key9: null,
    key10: null,
    key11: null,
    key12: null,
  });
  const keyElements = createInputKeys();

  return (
    <View style={styles.globalContainer}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={{flex: 1}}>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <SafeAreaView style={{flex: 1}}>
            <Back_BTN navigation={navigate} destination="Home" />
            <Text style={styles.headerText}>Enter your seed phrase</Text>
            <View style={styles.contentContainer}>
              <View style={styles.seedContainer}>{keyElements}</View>
            </View>
            <TouchableOpacity
              onPress={keyValidation}
              style={[BTN, {backgroundColor: COLORS.primary}, CENTER]}>
              <Text style={styles.continueBTN}>Restore wallet</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );

  function handleInputElement(e, keyNumber) {
    setKey(prev => {
      return {...prev, [`key${keyNumber}`]: e};
    });
  }

  function createInputKeys() {
    let keyRows = [];
    let keyItem = [];
    NUMKEYS.forEach(number => {
      keyItem.push(
        <View key={number} style={styles.seedItem}>
          <Text style={styles.numberText}>{number}.</Text>
          <TextInput
            onChangeText={e => handleInputElement(e, number)}
            style={styles.textInputStyle}
          />
        </View>,
      );
      if (number % 2 === 0) {
        keyRows.push(
          <View
            key={`row${number - 1}`}
            style={[styles.seedRow, {marginBottom: number != 12 ? 40 : 0}]}>
            {keyItem}
          </View>,
        );
        keyItem = [];
      }
    });
    return keyRows;
  }

  async function keyValidation() {
    const enteredKeys =
      Object.keys(key).filter(value => key[value]).length === 12;

    if (!enteredKeys) {
      navigate('RestoreWalletError', {
        reason: 'Please enter all of your keys',
        type: 'inputKeys',
      });
      return;
    }
    const mnemonic = Object.values(key).map(val => val.toLowerCase());

    const hasAccount = await isValidMnemonic(mnemonic);
    if (!hasAccount) {
      navigate('RestoreWalletError', {
        reason: 'This is not a valid mnemoinc.',
        type: 'mnemoicError',
      });
      return;
    } else {
      navigate('PinSetup');
      storeData('mnemonic', mnemonic.join(' '));
    }
  }
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: COLORS.lightModeBackground,
  },

  headerText: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.Title_Bold,
    textAlign: 'center',
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedContainer: {
    width: '80%',
    height: 'auto',
  },
  seedRow: {
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seedItem: {
    width: '48%',

    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 10,
  },
  numberText: {
    width: '25%',
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Regular,
  },
  textInputStyle: {
    width: '75%',
    fontSize: SIZES.large,
  },
  continueBTN: {
    fontSize: SIZES.large,
    fontFamily: FONT.Other_Regular,
    color: COLORS.background,
  },
});
