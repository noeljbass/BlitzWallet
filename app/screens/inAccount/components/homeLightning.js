import {StyleSheet, Text, View, ScrollView} from 'react-native';

import {CENTER, SIZES} from '../../../constants';
import {SendRecieveBTNs} from './sendReciveBTNs';
import {UserSatAmount} from '../../../components/admin/userSatAmount';
import {UserTransaction} from './userTransactions';
import {useEffect, useState} from 'react';
import {getTransactions} from '../../../functions/SDK';

const transactions = [
  {
    completed: true,
    description: 'testingtestingtestingtestingtestingtesting',
    date: 'this is a date',
    amount: '1,000',
    wasSent: false,
  },
  {
    completed: false,
    description: 'testing',
    date: 'this is a date',
    amount: '1,000',
    wasSent: true,
  },
  {
    completed: true,
    description: 'testing',
    date: 'this is a date',
    amount: '1,000',
    wasSent: true,
  },
  {
    completed: true,
    description: 'testing',
    date: 'this is a date',
    amount: '1,000',
    wasSent: false,
  },
  {
    completed: true,
    description: 'testing',
    date: 'this is a date',
    amount: '1,000',
    wasSent: true,
  },
];

export default function HomeLightning(props) {
  const [transactions, setTransactions] = useState([]);
  const transactionElement = transactions.map((transaction, id) => {
    return <UserTransaction key={id} {...transaction} />;
  });

  useEffect(() => {
    (async () => {
      const transactions = await getTransactions();
      console.log(transactions);
      setTransactions(transactions);
    })();
  }, [props.breezEvent]);
  return (
    <>
      <UserSatAmount breezEvent={props.breezEvent} />
      <ScrollView style={style.scrollContainer}>
        {transactionElement.length === 0 && (
          <View style={style.noTransactionsContainer}>
            <Text style={style.noTransactionsText}>
              Send or recive a transaction to see your activty here.
            </Text>
          </View>
        )}
        {transactionElement.length != 0 && transactionElement}
      </ScrollView>
      <SendRecieveBTNs
        // setScreenType={props.setScreenType}
        for="lightning"
        setIsCameraActive={props.setIsCameraActive}
        setRecivePayment={props.setRecivePayment}
        // setNeedToRefresh={props.setNeedToRefresh}
      />
    </>
  );
}

const style = StyleSheet.create({
  scrollContainer: {
    width: '90%',
    marginVertical: 20,
    ...CENTER,
  },
  noTransactionsContainer: {
    flex: 1,
  },
  noTransactionsText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
