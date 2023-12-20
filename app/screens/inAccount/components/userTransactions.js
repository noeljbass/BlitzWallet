import {View, Text, Image, StyleSheet, useColorScheme} from 'react-native';

import {COLORS, FONT, ICONS, SIZES} from '../../../constants';

export function UserTransaction(props) {
  const paymentDate = new Date(props.paymentTime * 1000).toLocaleString();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.transactionContainer}>
      {props.status === 'complete' ? (
        <Image
          source={ICONS.Checkcircle}
          style={styles.icons}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={ICONS.Xcircle}
          style={styles.icons}
          resizeMode="contain"
        />
      )}
      <View>
        <Text
          style={[
            styles.descriptionText,
            {color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText},
          ]}>
          {props.description.includes('bwrfd')
            ? 'faucet'
            : props.description.length > 20
            ? props.description.slice(0, 20) + '...'
            : props.description}
          {!props.description && 'No description'}
        </Text>

        <Text
          style={[
            styles.dateText,
            {color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText},
          ]}>
          {paymentDate}
        </Text>
      </View>

      {props.showAmount ? (
        props.paymentType != 'received' ? (
          <Text style={combinedStyles.wasSent}>
            -{props.amountMsat / 1000} Sat
          </Text>
        ) : (
          <Text style={combinedStyles.wasRecived}>
            +{props.amountMsat / 1000} Sat
          </Text>
        )
      ) : (
        <Text
          style={[
            styles.amountText,
            {
              fontSize: SIZES.medium,
              color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText,
            },
          ]}>
          *****
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icons: {
    width: 30,
    height: 30,
    marginRight: 15,
  },

  descriptionText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    fontFamily: FONT.Descriptoin_Bold,
  },
  dateText: {
    fontFamily: FONT.Descriptoin_Regular,
  },
  amountText: {
    marginLeft: 'auto',
    fontFamily: FONT.Other_Regular,
    fontSize: SIZES.medium,
  },
});

const combinedStyles = StyleSheet.create({
  wasSent: {
    ...styles.amountText,
    color: 'red',
  },
  wasRecived: {
    ...styles.amountText,
    color: 'green',
  },
});
