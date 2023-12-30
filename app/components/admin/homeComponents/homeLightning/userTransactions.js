import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {CENTER, COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';

const MILISECONDSDAYCONSTANT = 86400000;

export function UserTransactions(props) {
  const transactionObject = {
    currentDateString: '',
    groupedTransactions: [],
    tempGroupedTransactoins: [],
  };
  const navigate = useNavigation();
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    setTxs([
      <View style={[styles.noTransactionsContainer]} key={'noTx'}>
        <Text style={styles.noTransactionsText}>
          Send or receive a transaction for it to show up here
        </Text>
      </View>,
    ]);

    setTransactionElements();
  }, [props.transactions, props.showAmount, props.isDarkMode]);

  return <View style={{flex: 1}}>{txs}</View>;

  function setTransactionElements() {
    const transactionElements = props.transactions.map((transaction, id) => {
      const paymentDate = new Date(
        transaction.paymentTime * 1000 + MILISECONDSDAYCONSTANT,
      );

      if (id === 0)
        transactionObject.currentDateString = paymentDate.toDateString();

      if (transactionObject.currentDateString === paymentDate.toDateString()) {
        transactionObject.groupedTransactions.push(
          <UserTransaction
            isDarkMode={props.isDarkMode}
            showAmount={props.showAmount}
            key={id}
            {...transaction}
            navigate={navigate}
            transactions={props.transactions}
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

    const scrollTxs = (
      <ScrollView key={'hasTxs'} style={{width: '90%', ...CENTER}}>
        {transactionElements}
      </ScrollView>
    );

    setTxs([scrollTxs]);
  }
}

function UserTransaction(props) {
  const paymentDate = new Date(props.paymentTime * 1000).toLocaleString();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        props.navigate.navigate('ExpandedTx', {
          transactions: props.transactions,
          txId: props.details.data.paymentHash,
          isDarkMode: props.isDarkMode,
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
    height: 'auto',
    width: '90%',
    marginTop: 20,
    ...CENTER,
  },
  noTransactionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTransactionsText: {
    width: '90%',
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
