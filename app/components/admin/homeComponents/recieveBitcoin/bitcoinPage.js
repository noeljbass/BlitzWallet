import {
  inProgressSwap,
  openChannelFee,
  receiveOnchain,
} from '@breeztech/react-native-breez-sdk';
import {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';
import {COLORS, CENTER, FONT, SIZES} from '../../../../constants';
import QRCode from 'react-native-qrcode-svg';
import Slider from '@react-native-community/slider';

export default function BitcoinPage(props) {
  const [generatingQrCode, setGeneratingQrCode] = useState(true);
  const [bitcoinSwapInfo, setBitcoinSwapInfo] = useState({
    minAllowedDeposit: 0,
    maxAllowedDeposit: 0,
  });
  const [lnFee, setLnFee] = useState({
    receivingAmount: 0,
    lnFee: 0,
  });
  const [inPorgressSwapInfo, setInProgressSwapInfo] = useState({});

  useEffect(() => {
    if (props.selectedRecieveOption != 'bitcoin') return;

    initSwap();
    monitorSwap();
  }, [props.selectedRecieveOption]);

  return (
    <View
      style={{
        display: props.selectedRecieveOption === 'bitcoin' ? 'flex' : 'none',
      }}>
      <View style={[styles.qrcodeContainer]}>
        {generatingQrCode && (
          <ActivityIndicator
            size="large"
            color={props.theme ? COLORS.darkModeText : COLORS.lightModeText}
          />
        )}
        {!generatingQrCode && (
          <QRCode
            size={250}
            value={
              props.generatedAddress
                ? props.generatedAddress
                : 'Thanks for using Blitz!'
            }
            color={props.theme ? COLORS.darkModeText : COLORS.lightModeText}
            backgroundColor={
              props.theme
                ? COLORS.darkModeBackground
                : COLORS.lightModeBackground
            }
          />
        )}
      </View>
      {!generatingQrCode && (
        <View style={styles.sliderContainer}>
          <Text
            style={[
              styles.feeHeaderText,
              {
                color: props.theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Lightning Fee Calculator
          </Text>
          <Slider
            onSlidingComplete={handleFeeSlider}
            style={styles.sliderStyle}
            minimumValue={bitcoinSwapInfo.minAllowedDeposit}
            maximumValue={bitcoinSwapInfo.maxAllowedDeposit}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={
              props.theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset
            }
          />
          <View style={styles.feeeBreakdownContainer}>
            <View style={styles.feeBreakdownRow}>
              <Text
                style={[
                  styles.feeBreakdownDescriptor,
                  {
                    color: props.theme
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                Min Receivable (sat)
              </Text>
              <Text
                style={[
                  styles.feeBreakdownValue,
                  {
                    color: props.theme
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                {bitcoinSwapInfo.minAllowedDeposit.toLocaleString()}
              </Text>
            </View>
            <View style={styles.feeBreakdownRow}>
              <Text
                style={[
                  styles.feeBreakdownDescriptor,
                  {
                    color: props.theme
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                Max Receivable (sat)
              </Text>
              <Text
                style={[
                  styles.feeBreakdownValue,
                  {
                    color: props.theme
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                {bitcoinSwapInfo.maxAllowedDeposit.toLocaleString()}
              </Text>
            </View>
            <View style={styles.feeBreakdownRow}>
              <Text
                style={[
                  styles.feeBreakdownDescriptor,
                  {
                    color: props.theme
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                Receiving amount (sat)
              </Text>
              <Text
                style={[
                  styles.feeBreakdownValue,
                  {
                    color: props.theme
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                {lnFee.receivingAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.feeBreakdownRow}>
              <Text
                style={[
                  styles.feeBreakdownDescriptor,
                  {
                    color: props.theme
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                Lightning Fee (sat)
              </Text>
              <Text
                style={[
                  styles.feeBreakdownValue,
                  {
                    color: props.theme
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                {lnFee.lnFee.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  async function initSwap() {
    try {
      setGeneratingQrCode(true);
      const swapInfo = await receiveOnchain({});
      console.log(swapInfo.minAllowedDeposit);
      console.log(swapInfo.maxAllowedDeposit);
      const openChannelFeeResponse = await openChannelFee({
        amountMsat: swapInfo.minAllowedDeposit * 1000,
      });

      props.setGeneratedAddress(swapInfo.bitcoinAddress);
      setBitcoinSwapInfo({
        minAllowedDeposit: swapInfo.minAllowedDeposit,
        maxAllowedDeposit: swapInfo.maxAllowedDeposit,
      });
      setLnFee({
        lnFee: openChannelFeeResponse.feeMsat / 1000,
        receivingAmount: swapInfo.minAllowedDeposit,
      });

      setGeneratingQrCode(false);
    } catch (err) {
      console.log(err);
    }
  }
  async function monitorSwap() {
    try {
      const swapInfo = await inProgressSwap();
      if (!swapInfo) return;
      setInProgressSwapInfo(swapInfo);
    } catch (err) {
      console.log(err);
    }
  }
  async function handleFeeSlider(e) {
    console.log(Math.round(e));

    try {
      const openChannelFeeResponse = await openChannelFee({
        amountMsat: Number(Math.round(e)) * 1000,
      });
      setLnFee({
        lnFee: openChannelFeeResponse.feeMsat / 1000,
        receivingAmount: Number(Math.round(e)),
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  qrcodeContainer: {
    width: '90%',
    maxWidth: 250,
    height: 250,
    ...CENTER,

    marginVertical: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderStyle: {width: 200, height: 40, ...CENTER},
  sliderContainer: {
    width: '90%',
    ...CENTER,
    marginTop: 30,
  },
  feeHeaderText: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.large,

    textAlign: 'center',
    marginBottom: 20,
  },

  feeeBreakdownContainer: {
    width: '70%',
    ...CENTER,
  },

  feeBreakdownRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  feeBreakdownDescriptor: {
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.medium,
  },
  feeBreakdownValue: {
    fontFamily: FONT.Descriptoin_Bold,
    fontSize: SIZES.medium,
  },
});
