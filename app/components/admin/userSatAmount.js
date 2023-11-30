import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONT, SIZES} from '../../constants';

import {useEffect, useState} from 'react';
import {getLocalStorageItem, setLocalStorageItem} from '../../functions';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';

// import {getLocalStorageItem, setLocalStorageItem} from '../global';

export function UserSatAmount(props) {
  const [showAmount, setShowAmount] = useState(true);

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

  function formatBitcoinAmoutn(amout) {
    if (!Number(amout)) {
      return '0.00000000';
    }

    let formattedAmt = amout.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const numbers = formattedAmt.split('').filter(num => !!(Number(num) + 5)); // this takes out the commus from messing up how many numbers I the user has

    const loopAmt = numbers.length >= 7 ? 11 : numbers.length >= 4 ? 10 : 9;

    if (numbers.length < 9) {
      for (let i = formattedAmt.length; i < loopAmt; i++) {
        formattedAmt = '0' + formattedAmt;
      }
    }

    const displayAmt = formattedAmt
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      .split('');

    if (numbers.length > 9) {
      displayAmt.splice(2, 0, '.');
    } else {
      displayAmt.splice(1, 0, '.');
    }

    const indexOfFirst = indexOfNum(displayAmt, 0);

    if (indexOfFirst === -1) return;
    if (indexOfFirst === 0) {
      const indexOfSecond = indexOfNum(displayAmt, 1);
      return formatText(displayAmt, indexOfSecond);
    } else {
      return formatText(displayAmt, indexOfFirst);
    }
  }

  function indexOfNum(array, chosenIndex) {
    let numberOfNums = 0;

    for (let i = 0; i < array.length; i++) {
      const num = array[i];

      if (!(Number(num) + 5)) continue;
      if (num >= 1 && num <= 9) {
        if (numberOfNums === chosenIndex) return i;
        else {
          numberOfNums += 1;
          continue;
        }
      }
    }
    return -1;
  }

  function formatText(displayAmt, index) {
    if (index === -1) {
      const splitDipsplay = displayAmt.splice(0).join('').split(',').join(' ');
      return <Text>{splitDipsplay}</Text>;
    }
    const splitDipsplay = displayAmt
      .splice(index)
      .join('')
      .split(',')
      .join(' ');
    const styledSplit = (
      <Text>
        {displayAmt.splice(0, index).join('').split(',').join('')}
        <Text style={styles.yourValue}>{splitDipsplay}</Text>
      </Text>
    );

    return styledSplit;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        setShowAmount(prev => {
          setLocalStorageItem('showBalance', JSON.stringify(!prev));
          return !prev;
        });
      }}>
      <View style={styles.valueContainer}>
        <Text style={combinedStyles.bitcoinText}>BTC</Text>

        {showAmount && (
          <Text style={styles.valueText}>
            {formatBitcoinAmoutn(
              props.breezInformation?.userBalance.toFixed(0),
            )}
          </Text>
        )}
        {!showAmount && <Text style={styles.valueText}>* * * * *</Text>}
        <Text style={combinedStyles.satsText}>Sats</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  valueContainer: {
    width: 315,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',

    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 20,
  },

  denominatorText: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Regular,
  },
  valueText: {
    color: COLORS.gray,
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.Title_Regular,
  },
  yourValue: {
    color: COLORS.primary,
  },
});

const combinedStyles = StyleSheet.create({
  satsText: {
    ...styles.denominatorText,
    color: COLORS.primary,
  },
  bitcoinText: {
    ...styles.denominatorText,
    color: COLORS.gray,
  },
});
