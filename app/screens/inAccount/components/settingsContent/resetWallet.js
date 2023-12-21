import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {BTN, COLORS, FONT, SIZES} from '../../../../constants';
import {useState} from 'react';

export default function ResetPage(props) {
  const [selectedOptions, setSelectedOptions] = useState({
    seed: false,
    paymentHistory: false,
    pin: false,
  });
  // const props.isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View
        style={[
          styles.infoContainer,
          {
            marginTop: 30,
            backgroundColor: props.isDarkMode
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
          },
        ]}>
        <Text style={styles.warningHeader}>Are you sure?</Text>
      </View>
      <View
        style={[
          styles.infoContainer,
          {
            backgroundColor: props.isDarkMode
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
          },
        ]}>
        <Text
          style={[
            styles.infoTitle,
            {
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          Select data to delete from this device.
        </Text>
        <Text
          style={[
            styles.infoDescription,
            {
              marginBottom: 15,
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          Any option that is selected will be removed forever. If your seed is
          forgotten, you WILL lose your funds.
        </Text>
        <View
          style={[
            styles.borderView,
            {
              backgroundColor: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}></View>
        <View style={{marginTop: 15}}>
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              onPress={() => handleSelectedItems('seed')}
              style={[
                styles.selectorDot,
                selectedOptions.seed && styles.isSelectedDot,
                {
                  borderColor: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}></TouchableOpacity>
            <Text
              style={[
                styles.selectorText,
                {
                  color: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              Delete seed from my device
            </Text>
          </View>
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              onPress={() => handleSelectedItems('paymentHistory')}
              style={[
                styles.selectorDot,
                selectedOptions.paymentHistory && styles.isSelectedDot,
                {
                  borderColor: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}></TouchableOpacity>
            <Text
              style={[
                styles.selectorText,
                {
                  color: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              Delete payment history from my device
            </Text>
          </View>
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              onPress={() => handleSelectedItems('pin')}
              style={[
                styles.selectorDot,
                selectedOptions.pin && styles.isSelectedDot,
                {
                  borderColor: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}></TouchableOpacity>
            <Text
              style={[
                styles.selectorText,
                {
                  color: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              Delete pin from my device
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.infoContainer,
          {
            backgroundColor: props.isDarkMode
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
          },
        ]}>
        <Text
          style={[
            styles.infoTitle,
            {
              textAlign: 'center',
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          Your balance is
        </Text>
        <Text
          style={[
            styles.infoDescription,
            {
              textAlign: 'center',
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          1,500 sats
        </Text>
      </View>
      <TouchableOpacity
        onPress={resetWallet}
        style={[
          BTN,
          {
            backgroundColor: COLORS.primary,
            marginTop: 'auto',
            marginBottom: 'auto',
            opacity:
              selectedOptions.paymentHistory ||
              selectedOptions.pin ||
              selectedOptions.seed
                ? 1
                : 0.4,
          },
        ]}>
        <Text
          style={{
            fontFamily: FONT.Other_Regular,
            color: COLORS.white,
            fontSize: SIZES.medium,
          }}>
          Reset Wallet
        </Text>
      </TouchableOpacity>
    </View>
  );

  function handleSelectedItems(item) {
    setSelectedOptions(prev => {
      if (item === 'seed') return {...prev, seed: !prev.seed};
      else if (item === 'paymentHistory')
        return {...prev, paymentHistory: !prev.paymentHistory};
      else return {...prev, pin: !prev.pin};
    });
  }

  function resetWallet() {
    if (
      !selectedOptions.paymentHistory &&
      !selectedOptions.pin &&
      !selectedOptions.seed
    )
      return;
    console.log('RESET');
  }
}

const styles = StyleSheet.create({
  infoContainer: {
    width: '90%',
    backgroundColor: COLORS.offsetBackground,
    padding: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningHeader: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.large,
    color: COLORS.cancelRed,

    textAlign: 'center',
  },
  warningDescription: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  infoTitle: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
  infoDescription: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
  },
  borderView: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.black,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  selectorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    marginRight: 20,
  },
  isSelectedDot: {
    backgroundColor: COLORS.primary,
  },
  selectorText: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
  },
});
