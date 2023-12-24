import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {CENTER, COLORS, FONT, ICONS, SIZES} from '../../../constants';

export function UserTransactions(props) {
  const transactionObject = {
    currentDateString: '',
    groupedTransactions: [],
    tempGroupedTransactoins: [],
  };

  const transactionElements = props.transactions.map((transaction, id) => {
    const paymentDate = new Date(transaction.paymentTime * 1000);

    if (id === 0)
      transactionObject.currentDateString = paymentDate.toDateString();

    if (transactionObject.currentDateString === paymentDate.toDateString()) {
      transactionObject.groupedTransactions.push(
        <UserTransaction
          isDarkMode={props.isDarkMode}
          showAmount={props.showAmount}
          key={id}
          {...transaction}
          setExpandedTransactoin={props.setExpandedTransactoin}
        />,
      );
    } else {
      transactionObject.currentDateString = paymentDate.toDateString();
      transactionObject.tempGroupedTransactoins =
        transactionObject.groupedTransactions;
      transactionObject.groupedTransactions = [];

      if (transactionObject.tempGroupedTransactoins.length === 0) return;

      return (
        <View key={paymentDate.toDateString()}>
          <Text
            style={[
              styles.transactionTimeBanner,
              {
                backgroundColor: props.isDarkMode
                  ? COLORS.darkModeBackgroundOffset
                  : COLORS.lightModeBackgroundOffset,
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            {paymentDate.toDateString()}
          </Text>
          {transactionObject.tempGroupedTransactoins}
        </View>
      );
    }
  });

  return (
    <ScrollView style={styles.scrollContainer}>
      {transactionElements?.length === 0 && (
        <View style={styles.noTransactionsContainer}>
          <Text
            style={[
              styles.noTransactionsText,
              {
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            Send or receive a transaction to see your activty here.
          </Text>
        </View>
      )}
      {transactionElements?.length != 0 && transactionElements}
    </ScrollView>
  );
}

function UserTransaction(props) {
  const paymentDate = new Date(props.paymentTime * 1000).toLocaleString();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        props.setExpandedTransactoin({
          isDisplayed: true,
          txId: props.details.data.paymentHash,
        });
      }}>
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
              {
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
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
              {
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
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
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            *****
          </Text>
        )}
      </View>
    </TouchableOpacity>
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
  transactionTimeBanner: {
    width: '100%',
    alignItems: 'center',

    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,

    padding: 5,
    borderRadius: 2,
    overflow: 'hidden',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '90%',
    marginTop: 20,
    ...CENTER,
  },
  noTransactionsContainer: {
    flex: 1,
  },
  noTransactionsText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONT.Descriptoin_Regular,
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
