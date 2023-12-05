import {StyleSheet, Text, View, ScrollView} from 'react-native';

import {CENTER, SIZES, SHADOWS, FONT} from '../../../constants';

import {UserSatAmount} from '../../../components/admin/userSatAmount';
import {UserTransaction} from './userTransactions';
import {SendRecieveBTNs} from './sendReciveBTNs';
import {ReceivePaymentHome} from './recieveBitcoin';
import {useState} from 'react';
import SendPaymentHome from './sendBitcoin.js/home';

export default function HomeLightning(props) {
  const [recivePayment, setRecivePayment] = useState(false);
  const [sendPayment, setSendPayment] = useState(false);
  const transactionElement = props.breezInformation?.transactions?.map(
    (transaction, id) => {
      return <UserTransaction key={id} {...transaction} />;
    },
  );

  return (
    <>
      <UserSatAmount breezInformation={props.breezInformation} />
      <ScrollView style={style.scrollContainer}>
        {transactionElement?.length === 0 && (
          <View style={style.noTransactionsContainer}>
            <Text style={style.noTransactionsText}>
              Send or recive a transaction to see your activty here.
            </Text>
          </View>
        )}
        {transactionElement?.length != 0 && transactionElement}
      </ScrollView>
      <SendRecieveBTNs
        // setScreenType={props.setScreenType}
        for="lightning"
        setSendPayment={setSendPayment}
        setRecivePayment={setRecivePayment}
        // setNeedToRefresh={props.setNeedToRefresh}
      />
      {/* POPUPS */}
      <ReceivePaymentHome
        isDisplayed={recivePayment}
        setRecivePayment={setRecivePayment}
        transactions={props.transactions}
        breezInformation={props.breezInformation}
      />
      <SendPaymentHome
        isDisplayed={sendPayment}
        setSendPayment={setSendPayment}
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
    fontFamily: FONT.Descriptoin_Regular,
  },
});
