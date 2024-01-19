import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import axios from 'axios';
import {CannotSwapPage, EnterAmount, QrCodePage} from './liquidPagesComponents';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';

export default function LiquidPage(props) {
  const [liquidAmount, setLiquidAmount] = useState('2000');
  const [feeInfo, setFeeInfo] = useState({
    boltzFeePercent: 0,
    liquidFee: 0,
    hash: '',
  });

  const [processStage, setProcessStage] = useState({
    amount: true,
    qrCode: false,
  });
  const [maxAmount, setMaxAmount] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [canSwap, setCanSwap] = useState(false);
  const [swapErrorMessage, setSwapErrorMessage] = useState('');

  useEffect(() => {
    setProcessStage({
      amount: true,
      qrCode: false,
    });
    setLiquidAmount('2000');
    props.setIsSwapCreated(false);

    (async () => {
      try {
        await nodeInfo();
        const swapInfo = await getSwapPairInformation();
        if (!swapInfo) return;
        setMaxAmount(swapInfo.limits.maximal);
        setMinAmount(swapInfo.limits.minimal + 1000);
        setFeeInfo({
          boltzFeePercent: swapInfo.fees.percentageSwapIn / 100,
          liquidFee: swapInfo.fees.minerFees.baseAsset?.normal,
          hash: swapInfo.hash,
        });
        setCanSwap(true);
      } catch (err) {
        console.log(err);
        setSwapErrorMessage('Not connected to node.');
      }
    })();
  }, []);

  return (
    <View style={[styles.container]}>
      {!canSwap ? (
        <CannotSwapPage
          swapErrorMessage={swapErrorMessage}
          isDarkMode={props.isDarkMode}
        />
      ) : (
        <>
          {processStage.amount && (
            <EnterAmount
              setLiquidAmount={setLiquidAmount}
              liquidAmount={liquidAmount}
              selectedRecieveOption={props.selectedRecieveOption}
              setProcessStage={setProcessStage}
              feeInfo={feeInfo}
              setFeeInfo={setFeeInfo}
              isDarkMode={props.isDarkMode}
              setIsSwapCreated={props.setIsSwapCreated}
              maxAmount={maxAmount}
              minAmount={minAmount}
            />
          )}

          {processStage.qrCode && (
            <QrCodePage
              liquidAmount={liquidAmount}
              feeInfo={feeInfo}
              isDarkMode={props.isDarkMode}
              setGeneratedAddress={props.setGeneratedAddress}
              generatedAddress={props.generatedAddress}
            />
          )}
        </>
      )}
    </View>
  );
}

async function getSwapPairInformation() {
  console.log('RUNNING');
  try {
    const request = await axios.get('https://api.boltz.exchange/getpairs');
    const data = request.data.pairs['L-BTC/BTC'];
    return new Promise(resolve => {
      resolve(data);
    });
  } catch (err) {
    console.log(err);
    return new Promise(resolve => {
      resolve(false);
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
