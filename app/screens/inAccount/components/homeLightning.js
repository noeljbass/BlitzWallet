import {StyleSheet, Text, View, ScrollView} from 'react-native';

import {CENTER, SIZES, SHADOWS} from '../../../constants';
import {SendRecieveBTNs} from './sendReciveBTNs';
import {UserSatAmount} from '../../../components/admin/userSatAmount';
import {UserTransaction} from './userTransactions';
import {useEffect, useState} from 'react';
import {getTransactions} from '../../../functions/SDK';

export default function HomeLightning(props) {
  const [transactions, setTransactions] = useState([]);
  const [counter, setCounter] = useState(0);
  const transactionElement = transactions?.map((transaction, id) => {
    return <UserTransaction key={id} {...transaction} />;
  });

  useEffect(() => {
    if (Object.keys(props.breezEvent).length === 0) return;
    (async () => {
      if (props.breezEvent.type === 'invoicePaid' || counter === 0) {
        const transactions = await getTransactions();

        setTransactions(transactions);
        setCounter(prev => (prev += 1));
      }
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
