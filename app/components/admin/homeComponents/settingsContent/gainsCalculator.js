import {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useGlobalContextProvider} from '../../../../../context-store/context';
import axios from 'axios';

export default function GainsCalculator() {
  const [isCalculatingGains, setIsCalculatingGains] = useState(true);
  const {nodeInformation} = useGlobalContextProvider();
  // console.log(nodeInformation.transactions);
  getSpotPrice(nodeInformation);
  return <View style={styles.globalContainer}></View>;
}

async function getSpotPrice(nodeInformation) {
  const oldestTx = new Date(
    nodeInformation.transactions[nodeInformation.transactions.length - 1]
      .paymentTime * 1000,
  );

  const url = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${oldestTx
    .toISOString()
    .slice(0, 10)}&end=${new Date().toISOString().slice(0, 10)}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  try {
    return data.bpi[Object.keys(data.bpi)[0]];
  } catch (err) {
    return null;
  }
}
const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
});
