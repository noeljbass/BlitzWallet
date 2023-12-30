import {StyleSheet, Text, View} from 'react-native';

import {CENTER, SIZES, FONT, COLORS} from '../../../constants';

import {UserSatAmount} from './homeLightning/userSatAmount';
import {UserTransactions} from './homeLightning/userTransactions';
import {SendRecieveBTNs} from './homeLightning/sendReciveBTNs';
import {useEffect, useRef, useState} from 'react';
import {getLocalStorageItem} from '../../../functions';
import {useNavigation} from '@react-navigation/native';

export default function HomeLightning(props) {
  console.log('HOME LIGHTNING PAGE');
  const navigate = useNavigation();
  const [showAmount, setShowAmount] = useState(true);
  const [lastTxHash, setLastTxHash] = useState('');

  useEffect(() => {
    if (Object.keys(props.breezEvent).length === 0) return;
    if (props.breezEvent?.details?.payment?.description?.includes('bwrfd'))
      return;
    if (props.breezEvent?.details?.paymentHash === lastTxHash) return;
    if (navigate.canGoBack()) navigate.goBack();
    navigate.navigate('ConfirmTxPage', {
      isDarkMode: props.isDarkMode,
      for: props.breezEvent.type,
      information: props.breezEvent,
    });
    setLastTxHash(props.breezEvent?.details.paymentHash);
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
      />
      <SendRecieveBTNs isDarkMode={props.isDarkMode} />
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
