import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  useColorScheme,
} from 'react-native';

import {CENTER, SIZES, FONT, COLORS} from '../../../constants';

import {UserSatAmount} from '../../../components/admin/userSatAmount';
import {UserTransactions} from './userTransactions';
import {SendRecieveBTNs} from './sendReciveBTNs';
import {ReceivePaymentHome} from './recieveBitcoin';
import {useEffect, useRef, useState} from 'react';
import SendPaymentHome from './sendBitcoin.js/home';
import ConfirmPage from './confirmPage';
import {getLocalStorageItem} from '../../../functions';
import TransactionDetials from './transactionDetails';

export default function HomeLightning(props) {
  console.log('HOME LIGHTNING PAGE');
  const [recivePayment, setRecivePayment] = useState(false);
  const [sendPayment, setSendPayment] = useState(false);
  const [confirmPage, setConfirmPage] = useState({
    for: '',
    isDisplayed: false,
  });
  const [showAmount, setShowAmount] = useState(true);
  const [expandedTransaction, setExpandedTransactoin] = useState({
    isDisplayed: false,
    txId: null,
  });

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
      console.log(props.breezEvent.type, 'CONFIRM PAGE');
      setConfirmPage({
        for: props.breezEvent.type,
        isDisplayed: true,
      });
    }
  }, [props.breezEvent]);

  return (
    <View style={style.globalContainer}>
      <UserSatAmount
        setShowAmount={setShowAmount}
        showAmount={showAmount}
        breezInformation={props.breezInformation}
        isDarkMode={props.isDarkMode}
      />
      {!props.breezInformation.didConnectToNode && (
        <View style={style.errorContainer}>
          <Text style={style.errorText}>
            Not connected to node. Balances and transactions may not be updated
          </Text>
        </View>
      )}

      <UserTransactions
        transactions={props.breezInformation.transactions}
        isDarkMode={props.isDarkMode}
        showAmount={showAmount}
        setExpandedTransactoin={setExpandedTransactoin}
      />
      <SendRecieveBTNs
        setSendPayment={setSendPayment}
        setRecivePayment={setRecivePayment}
      />

      {/* POPUPS */}
      {recivePayment && (
        <ReceivePaymentHome
          isDisplayed={recivePayment}
          setRecivePayment={setRecivePayment}
          isDarkMode={props.isDarkMode}
        />
      )}
      {sendPayment && (
        <SendPaymentHome
          isDisplayed={sendPayment}
          setSendPayment={setSendPayment}
          confirmPageDisplayed={confirmPage.isDisplayed}
          isDarkMode={props.isDarkMode}
        />
      )}
      {confirmPage.isDisplayed && (
        <ConfirmPage
          information={props.breezEvent}
          setConfirmPage={setConfirmPage}
          {...confirmPage}
          isDarkMode={props.isDarkMode}
        />
      )}
      {expandedTransaction.isDisplayed && (
        <TransactionDetials
          isDisplayed={expandedTransaction.isDisplayed}
          txId={expandedTransaction.txId}
          transactions={props.breezInformation?.transactions}
          showAmount={showAmount}
          setExpandedTransactoin={setExpandedTransactoin}
          isDarkMode={props.isDarkMode}
        />
      )}
    </View>
  );
}

const style = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },

  errorContainer: {
    width: '95%',
    backgroundColor: 'orange',

    padding: 8,
    ...CENTER,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cancelRed,

    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
});
