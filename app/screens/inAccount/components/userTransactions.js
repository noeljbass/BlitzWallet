import {View, Text, Image, StyleSheet} from 'react-native';

import {FONT, ICONS, SIZES} from '../../../constants';

export function UserTransaction(props) {
  const paymentDate = new Date(props.paymentTime * 1000).toDateString();
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
        <Text style={styles.descriptionText}>
          {props.description.length > 20
            ? props.description.slice(0, 20) + '...'
            : props.description}
        </Text>

        <Text style={styles.dateText}>{paymentDate}</Text>
      </View>

      {props.paymentType != 'received' ? (
        <Text style={combinedStyles.wasSent}>sent</Text>
      ) : (
        <Text style={combinedStyles.wasRecived}>Recieved</Text>
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
