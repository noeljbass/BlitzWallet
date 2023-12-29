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
import {useEffect, useRef, useState} from 'react';
import ConfirmPage from './confirmPage';
import {getLocalStorageItem} from '../../../functions';
import TransactionDetials from './transactionDetails';
import {useNavigation} from '@react-navigation/native';

export default function HomeLightning(props) {
  console.log('HOME LIGHTNING PAGE');
  const navigate = useNavigation();
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
      if (navigate.canGoBack()) navigate.goBack();

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
      <SendRecieveBTNs isDarkMode={props.isDarkMode} />

      {/* POPUPS */}

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
