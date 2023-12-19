import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BTN, COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../../constants';
import {useEffect, useState} from 'react';
import {ReloadInstructions} from 'react-native/Libraries/NewAppScreen';

export default function DrainPage(props) {
  const [wantsToDrain, setWantsToDrain] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    if (!wantsToDrain) return;
    console.log('DRAINING WALLET');
  }, [wantsToDrain]);

  return (
    <View style={styles.globalContainer}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceDescription}>Current balance</Text>
        <Text style={styles.balanceNum}>
          {Number(25000).toLocaleString()} sats
        </Text>
        <Text style={styles.fiatBalanceNum}>= $2.5 usd</Text>
      </View>

      <View style={styles.btcAdressContainer}>
        <Text style={styles.btcAdressHeader}>Enter BTC address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={props.bitcoinAddress}
            onChangeText={props.setBitcoinAddress}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => {
              props.setDisplayPopup({
                isDisplayed: true,
                type: 'btcCamera',
              });
            }}>
            <Image style={styles.scanIcon} source={ICONS.faceIDIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          setShowConfirmPopup(true);
          props.setDisplayPopup({
            isDisplayed: true,
            type: 'confirmDrain',
            variable: setWantsToDrain,
          });
        }}
        style={[
          BTN,
          {
            backgroundColor: COLORS.primary,
            marginTop: 'auto',
            marginBottom: 50,
          },
        ]}>
        <Text style={styles.buttonText}>Drain</Text>
      </TouchableOpacity>
    </View>
  );
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
