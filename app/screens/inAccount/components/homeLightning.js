import {StyleSheet, Text, View, ScrollView} from 'react-native';

import {CENTER} from '../../../constants';
import {SendRecieveBTNs} from './sendReciveBTNs';
import {UserSatAmount} from '../../../components/admin/userSatAmount';
import {UserTransaction} from './userTransactions';

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
  const transactionElement = transactions.map((transaction, id) => {
    return <UserTransaction key={id} {...transaction} />;
  });
  return (
    <>
      <UserSatAmount bitcoinAmt="0" />
      <ScrollView style={style.scrollContainer}>
        {transactionElement}
      </ScrollView>
      <SendRecieveBTNs
        setScreenType={props.setScreenType}
        for="lightning"
        setIsCameraActive={props.setIsCameraActive}
        setRecivePayment={props.setRecivePayment}
        setNeedToRefresh={props.setNeedToRefresh}
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
});
