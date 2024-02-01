import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {CENTER, SIZES, FONT, COLORS} from '../../../constants';

import {UserSatAmount} from './homeLightning/userSatAmount';
import {UserTransactions} from './homeLightning/userTransactions';
import {SendRecieveBTNs} from './homeLightning/sendReciveBTNs';
import {useEffect, useRef, useState} from 'react';
import LiquidityIndicator from './homeLightning/liquidityIndicator';
import {useGlobalContextProvider} from '../../../../context-store/context';
import {getLocalStorageItem} from '../../../functions';

export default function HomeLightning() {
  console.log('HOME LIGHTNING PAGE');
  const [showAmount, setShowAmount] = useState(true);
  const {userTxPreferance, nodeInformation} = useGlobalContextProvider();

  useEffect(() => {
    (async () => {
      const displayAmount = JSON.parse(
        await getLocalStorageItem('showBalance'),
      );

      if (displayAmount != null) {
        setShowAmount(displayAmount);
      } else setShowAmount(true);
    })();
  }, []);

  return (
    <View style={style.globalContainer}>
      <UserSatAmount setShowAmount={setShowAmount} showAmount={showAmount} />
      {!nodeInformation.didConnectToNode ? (
        <View style={style.errorContainer}>
          <Text style={style.errorText}>
            Not connected to node. Your balance and transactions may not be up
            to date.
          </Text>
        </View>
      ) : (
        <LiquidityIndicator showAmount={showAmount} />
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
    color: COLORS.lightModeText,
  },
});
