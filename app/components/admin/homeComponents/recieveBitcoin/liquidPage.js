import {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
import {CannotSwapPage, EnterAmount, QrCodePage} from './liquidPagesComponents';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';
import {CENTER, COLORS, SIZES} from '../../../../constants';
import {getSwapPairInformation} from '../../../../functions/LBTC';

export default function LiquidPage(props) {
  const [liquidAmount, setLiquidAmount] = useState('2000');
  const [feeInfo, setFeeInfo] = useState({
    boltzFeePercent: 0,
    liquidFee: 0,
    hash: '',
    minAmount: 0,
    maxAmount: 0,
  });

  const [processStage, setProcessStage] = useState({
    amount: true,
    qrCode: false,
  });

  const [canSwap, setCanSwap] = useState(false);
  const [swapErrorMessage, setSwapErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        await nodeInfo();
        const swapInfo = await getSwapPairInformation();
        if (!swapInfo) return;
        setFeeInfo({
          boltzFeePercent: swapInfo.fees.percentageSwapIn / 100,
          liquidFee: swapInfo.fees.minerFees.baseAsset?.normal,
          hash: swapInfo.hash,
          minAmount: swapInfo.limits.minimal + 1000,
          maxAmount: swapInfo.limits.maximal,
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
      {/* CANNOT SWAP PAGE WHEN NOT CONNECTED TO NODE */}
      {!canSwap && (
        <View
          style={[
            styles.qrcodeContainer,
            {
              marginBottom: 'auto',
              marginVertical: 20,
              justifyContent: 'space-between',
            },
          ]}>
          <ActivityIndicator
            size="large"
            color={
              props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText
            }
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              transform: [{translateY: 12}],
            }}
          />
          <Text
            style={{
              fontSize: SIZES.large,
              color: COLORS.cancelRed,
            }}>
            {swapErrorMessage ? swapErrorMessage : ' '}
          </Text>
        </View>
      )}

      {canSwap && (
        <>
          {processStage.amount && (
            <EnterAmount
              setLiquidAmount={setLiquidAmount}
              liquidAmount={liquidAmount}
              setProcessStage={setProcessStage}
              feeInfo={feeInfo}
              isDarkMode={props.isDarkMode}
              setIsSwapCreated={props.setIsSwapCreated}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //
  qrcodeContainer: {
    width: '90%',
    maxWidth: 250,
    height: 250,
    ...CENTER,

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
});
