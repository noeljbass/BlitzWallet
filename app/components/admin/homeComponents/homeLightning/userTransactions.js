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
import {getLocalStorageItem} from '../../../../functions';

export function UserTransactions(props) {
  const [txs, setTxs] = useState([]);
  const navigate = useNavigation();

  useEffect(() => {
    setTxs([
      <View style={[styles.noTransactionsContainer]} key={'noTx'}>
        <Text
          style={[
            styles.noTransactionsText,
            {color: props.theme ? COLORS.darkModeText : COLORS.lightModeText},
          ]}>
          Send or receive a transaction for it to show up here
        </Text>
      </View>,
    ]);

    if (props.transactions.length === 0) return;

    setTransactionElements(setTxs, props, navigate);
  }, [props.transactions, props.showAmount, props.theme, props.numTx]);

  return <View style={{flex: 1}}>{txs}</View>;
}

function setTransactionElements(setTxs, props, navigate) {
  let formattedTxs = [];
  let currentGroupedDate = '';

  const amountOfTxArr =
    typeof props.numTx === 'number'
      ? props.transactions.slice(0, props.numTx)
      : props.transactions;

  amountOfTxArr.forEach((tx, id) => {
    const paymentDate = new Date(tx.paymentTime * 1000);
    const styledTx = (
      <UserTransaction
        theme={props.theme}
        showAmount={props.showAmount}
        key={id}
        {...tx}
        navigate={navigate}
        transactions={props.transactions}
      />
    );
    if (id === 0 || currentGroupedDate != paymentDate.toDateString()) {
      currentGroupedDate = paymentDate.toDateString();

      formattedTxs.push(dateBanner(paymentDate.toDateString(), props.theme));
    }

    formattedTxs.push(styledTx);
  });

  const scrollTxs = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      key={'hasTxs'}
      style={{width: '95%', ...CENTER}}>
      {formattedTxs}
      {props?.from != 'viewAll' && formattedTxs.length != 0 && (
        <View style={styles.mostRecentTxContainer}>
          <Text
            style={{
              color: props.theme ? COLORS.darkModeText : COLORS.lightModeText,
            }}>
            Most recent {props.numTx} transactions
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigate.navigate('ViewAllTxPage', {
                breezInformation: props.breezInformation,
              });
            }}>
            <Text style={{color: COLORS.primary}}>See all transactions</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  setTxs(scrollTxs);
}

function dateBanner(date, theme) {
  return (
    <View key={date}>
      <Text
        style={[
          styles.transactionTimeBanner,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
            color: theme ? COLORS.darkModeText : COLORS.lightModeText,
          },
        ]}>
        {date}
      </Text>
    </View>
  );
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
          theme: props.theme,
        });
      }}>
      <View style={styles.transactionContainer}>
        <Image
          source={
            props.status === 'complete' ? ICONS.Checkcircle : ICONS.Xcircle
          }
          style={styles.icons}
          resizeMode="contain"
        />

        <View>
          <Text
            style={[
              styles.descriptionText,
              {
                color: props.theme ? COLORS.darkModeText : COLORS.lightModeText,
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
                color: props.theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {paymentDate}
          </Text>
        </View>
        <Text
          style={[
            styles.amountText,
            {
              color: props.showAmount
                ? props.paymentType === 'received'
                  ? 'green'
                  : 'red'
                : props.theme
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          {props.showAmount
            ? (props.paymentType === 'received' ? '+' : '-') +
              (props.amountMsat / 1000).toLocaleString() +
              ' Sat'
            : ' *****'}
        </Text>
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

  mostRecentTxContainer: {
    width: 'auto',
    ...CENTER,
    alignItems: 'center',
  },
});
