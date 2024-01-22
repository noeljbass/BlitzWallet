import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {CENTER, SIZES, FONT, COLORS} from '../../../constants';

import {UserSatAmount} from './homeLightning/userSatAmount';
import {UserTransactions} from './homeLightning/userTransactions';
import {SendRecieveBTNs} from './homeLightning/sendReciveBTNs';
import {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import LiquidityIndicator from './homeLightning/liquidityIndicator';
import {useGlobalContextProvider} from '../../../../context-store/context';

export default function HomeLightning(props) {
  console.log('HOME LIGHTNING PAGE');
  const navigate = useNavigation();
  const [showAmount, setShowAmount] = useState(true);
  const {userTxPreferance, nodeInformation, theme} = useGlobalContextProvider();

  useEffect(() => {
    if (Object.keys(props.breezEvent).length === 0) return;
    if (props.breezEvent?.details?.payment?.description?.includes('bwrfd'))
      return;
    if (navigate.canGoBack()) navigate.navigate('HomeAdmin');
    navigate.navigate('ConfirmTxPage', {
      theme: theme,
      for: props.breezEvent.type,
      information: props.breezEvent,
    });
  }, [props.breezEvent]);

  return (
    <View style={style.globalContainer}>
      <UserSatAmount setShowAmount={setShowAmount} showAmount={showAmount} />
      {!nodeInformation.didConnectToNode ? (
        <View style={style.errorContainer}>
          <Text style={style.errorText}>
            Not connected to node. Balances and transactions may not be updated
          </Text>
        </View>
      ) : (
        <LiquidityIndicator />
      )}

      <UserTransactions showAmount={showAmount} numTx={userTxPreferance} />
      <SendRecieveBTNs />
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
    marginBottom: 10,
  },
  errorText: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
});
