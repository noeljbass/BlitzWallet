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
import {UserTransaction} from './userTransactions';
import {SendRecieveBTNs} from './sendReciveBTNs';
import {ReceivePaymentHome} from './recieveBitcoin';
import {useEffect, useRef, useState} from 'react';
import SendPaymentHome from './sendBitcoin.js/home';
import ConfirmPage from './confirmPage';
import {getLocalStorageItem} from '../../../functions';

export default function HomeLightning(props) {
  console.log('HOME LIGHTNING PAGE');
  const [recivePayment, setRecivePayment] = useState(false);
  const [sendPayment, setSendPayment] = useState(false);
  const [confirmPage, setConfirmPage] = useState({
    for: '',
    isDisplayed: false,
  });
  const [showAmount, setShowAmount] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

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
    <View style={style.globalContainer}>
      <UserSatAmount
        setShowAmount={setShowAmount}
        showAmount={showAmount}
        breezInformation={props.breezInformation}
      />
      {!props.breezInformation.didConnectToNode && (
        <View style={style.errorContainer}>
          <Text style={style.errorText}>
            Not connected to node. Balances and transactions may not be updated
          </Text>
        </View>
      )}
      <ScrollView style={style.scrollContainer}>
        {transactionElement?.length === 0 && (
          <View style={style.noTransactionsContainer}>
            <Text
              style={[
                style.noTransactionsText,
                {
                  color: isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              Send or receive a transaction to see your activty here.
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
      {recivePayment && (
        <ReceivePaymentHome
          isDisplayed={recivePayment}
          setRecivePayment={setRecivePayment}
        />
      )}
      {sendPayment && (
        <SendPaymentHome
          isDisplayed={sendPayment}
          setSendPayment={setSendPayment}
          confirmPageDisplayed={confirmPage.isDisplayed}
        />
      )}
      {confirmPage.isDisplayed && (
        <ConfirmPage
          information={props.breezEvent}
          setConfirmPage={setConfirmPage}
          {...confirmPage}
        />
      )}
    </View>
  );
}

function TransactionListElements(props) {
  // const isInitialRender = useRef(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      if (isInitialRender.current) {
        const storedTransaction = await getLocalStorageItem('breezInfo');
        isInitialRender.current = false;
        if (!storedTransaction) return;
        setTransactions(JSON.parse(storedTransaction)[0]);
      } else {
        setTransactions(props?.breezTransactions?.transactions);
      }
    })();
  }, [props?.breezTransactions?.transactions]);

  const transactionElement = transactions?.map((transaction, id) => {
    return (
      <UserTransaction
        showAmount={props.showAmount}
        key={id}
        {...transaction}
      />
    );
  });

  return (
    <>
      {transactionElement?.length === 0 && (
        <View style={style.noTransactionsContainer}>
          <Text style={style.noTransactionsText}>
            Send or recive a transaction to see your activty here.
          </Text>
        </View>
      )}
      {transactionElement?.length != 0 && transactionElement}
    </>
  );
}
const style = StyleSheet.create({
  globalContainer: {
    flex: 1,
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
