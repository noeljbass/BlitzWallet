import {StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';

import {CENTER, SIZES, FONT} from '../../../constants';

import {UserSatAmount} from '../../../components/admin/userSatAmount';
import {UserTransaction} from './userTransactions';
import {SendRecieveBTNs} from './sendReciveBTNs';
import {ReceivePaymentHome} from './recieveBitcoin';
import {useEffect, useState} from 'react';
import SendPaymentHome from './sendBitcoin.js/home';
import ConfirmPage from './confirmPage';

export default function HomeLightning(props) {
  console.log('HOME LIGHTNING PAGE');
  const [recivePayment, setRecivePayment] = useState(false);
  const [sendPayment, setSendPayment] = useState(false);
  const [confirmPage, setConfirmPage] = useState({
    for: '',
    isDisplayed: false,
  });
  const [showAmount, setShowAmount] = useState(true);

  useEffect(() => {
    if (Object.keys(props.breezEvent).length === 0) return;
    if (props.breezEvent?.details?.payment?.description?.includes('bwrfd'))
      return;
    if (
      props.breezEvent.type === 'invoicePaid' ||
      props.breezEvent.type === 'paymentSucceed'
    ) {
      if (props.breezEvent.type === 'invoicePaid') setRecivePayment(false);
      else setSendPayment(false);
      setConfirmPage({
        for: props.breezEvent.type,
        isDisplayed: true,
      });
    }
  }, [props.breezEvent]);

  const transactionElement = props.breezInformation?.transactions?.map(
    (transaction, id) => {
      return (
        <UserTransaction showAmount={showAmount} key={id} {...transaction} />
      );
    },
  );

  return (
    <>
      <UserSatAmount
        setShowAmount={setShowAmount}
        showAmount={showAmount}
        breezInformation={props.breezInformation}
      />
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
        setSendPayment={setSendPayment}
        setRecivePayment={setRecivePayment}
      />

      {/* POPUPS */}
      <ReceivePaymentHome
        isDisplayed={recivePayment}
        setRecivePayment={setRecivePayment}
      />
      <SendPaymentHome
        isDisplayed={sendPayment}
        setSendPayment={setSendPayment}
        confirmPageDisplayed={confirmPage.isDisplayed}
      />
      <ConfirmPage
        information={props.breezEvent}
        setConfirmPage={setConfirmPage}
        {...confirmPage}
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
