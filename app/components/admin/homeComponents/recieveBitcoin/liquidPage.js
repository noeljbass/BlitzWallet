import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
} from 'react-native';
import {
  COLORS,
  FONT,
  ICONS,
  SHADOWS,
  SIZES,
  CENTER,
} from '../../../../constants';
import {
  createLiquidSwap,
  getSwapPairInformation,
} from '../../../../functions/LBTC';
import QRCode from 'react-native-qrcode-svg';
import {receivePayment} from '@breeztech/react-native-breez-sdk';
import RNEventSource from 'react-native-event-source';
import * as Device from 'expo-device';

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

  useEffect(() => {
    if (props.selectedRecieveOption === 'liquid') return;
    setProcessStage({
      amount: true,
      qrCode: false,
    });
    setLiquidAmount('2000');
    props.setIsSwapCreated(false);
  }, [props.selectedRecieveOption]);

  return (
    <View
      style={{
        flex: 1,
        display: props.selectedRecieveOption === 'liquid' ? 'flex' : 'none',
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // marginBottom: Device.osName === 'Android' ? 10 : 0,
        }}>
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
      </View>
    </View>
  );
}

function EnterAmount(props) {
  const [maxAmount, setMaxAmount] = useState('');
  const [minAmount, setMinAmount] = useState('');

  useEffect(() => {
    if (props.selectedRecieveOption != 'liquid') return;

    (async () => {
      const swapInfo = await getSwapPairInformation();
      if (!swapInfo) return;
      setMaxAmount(swapInfo.limits.maximal);
      setMinAmount(swapInfo.limits.minimal + 1000);
      props.setFeeInfo({
        boltzFeePercent: swapInfo.fees.percentageSwapIn / 100,
        liquidFee: swapInfo.fees.minerFees.baseAsset?.normal,
        hash: swapInfo.hash,
      });
    })();

    // generateSwapAddress();
  }, [props.selectedRecieveOption]);
  return (
    <>
      <View
        style={[
          styles.inputContainer,
          {
            marginTop: 'auto',
            backgroundColor: props.isDarkMode
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
            borderColor: props.isDarkMode
              ? COLORS.darkModeText
              : COLORS.lightModeText,
          },
        ]}>
        <View style={styles.labelContainer}>
          <Image
            style={{width: 30, height: 30, marginRight: 5}}
            source={ICONS.liquidIcon}
          />
          <Text style={styles.labelText}>Liquid</Text>
        </View>

        <TextInput
          style={[
            styles.inputField,
            {
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}
          keyboardType="number-pad"
          onChangeText={props.setLiquidAmount}
          value={props.liquidAmount}
        />
      </View>
      <View style={styles.feeContainer}>
        <View style={[styles.feeRow, {marginBottom: 5}]}>
          <Text
            style={[
              styles.feeLabel,
              {
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            Network Fee
          </Text>
          <Text
            style={[
              styles.feeText,
              {
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            {props.feeInfo.liquidFee}
          </Text>
        </View>
        <View style={styles.feeRow}>
          <Text
            style={[
              styles.feeLabel,
              {
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            Boltz Fee (0.1%)
          </Text>
          <Text
            style={[
              styles.feeText,
              {
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            {props.feeInfo.boltzFeePercent * props.liquidAmount}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: COLORS.opaicityGray,
            borderColor: props.isDarkMode
              ? COLORS.darkModeText
              : COLORS.lightModeText,
          },
        ]}>
        <View style={styles.labelContainer}>
          <Image
            style={{width: 30, height: 30, marginRight: 5}}
            source={ICONS.lightningIcon}
          />
          <Text style={styles.labelText}>Lightning</Text>
        </View>

        <Text style={styles.inputField}>
          {props.liquidAmount -
            props.feeInfo.liquidFee -
            props.liquidAmount * props.feeInfo.boltzFeePercent}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (props.liquidAmount > maxAmount || props.liquidAmount < minAmount)
            return;
          props.setProcessStage(prev => {
            return {...prev, amount: false, qrCode: true};
          });
          props.setIsSwapCreated(true);
        }}
        style={[
          styles.createSwapBTN,
          {
            opacity:
              props.liquidAmount > maxAmount || props.liquidAmount < minAmount
                ? 0.4
                : 1,
          },
        ]}>
        <Text style={styles.buttonText}>Create swap</Text>
      </TouchableOpacity>
    </>
  );
}

function QrCodePage(props) {
  const [generatingQrCode, setGeneratingQrCode] = useState(true);
  // const [generatedAddress, setGeneratedAddress] = useState('');
  const [evenSource, setEventSource] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const satAmount =
          props.liquidAmount -
          props.feeInfo.liquidFee -
          props.liquidAmount * props.feeInfo.boltzFeePercent;

        const invoice = await receivePayment({
          amountMsat: satAmount * 1000,
          description: 'Liquid Swap',
        });

        if (invoice) {
          const swapInfo = await createLiquidSwap(
            invoice.lnInvoice.bolt11,
            props.feeInfo.hash,
          );

          props.setGeneratedAddress(swapInfo.bip21);
          setGeneratingQrCode(false);

          const eventSource = new RNEventSource(
            'https://api.boltz.exchange/streamswapstatus?id=' + swapInfo.id,
          );
          eventSource.addEventListener('message', event => {
            setEventSource(event.data);
          });
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <>
      <View style={[styles.qrcodeContainer]}>
        {generatingQrCode && (
          <ActivityIndicator
            size="large"
            color={
              props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText
            }
          />
        )}
        {!generatingQrCode && (
          <QRCode
            size={250}
            value={
              props.generatedAddress ? props.generatedAddress : 'lets swap'
            }
            color={
              props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText
            }
            backgroundColor={
              props.isDarkMode
                ? COLORS.darkModeBackground
                : COLORS.lightModeBackground
            }
          />
        )}
      </View>
      <View style={styles.transactionStatusContainer}>
        <Text
          style={[
            styles.statusTitle,
            {
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          Status:
        </Text>
        <View style={{height: 80, justifyContent: 'space-between'}}>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  evenSource === '{"status":"invoice.set"}' ||
                  evenSource === '{"status":"transaction.mempool"}' ||
                  evenSource === '{"status":"invoice.pending"}'
                    ? 'green'
                    : props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
              },
            ]}>
            Invoice Set
          </Text>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  evenSource === '{"status":"transaction.mempool"}' ||
                  evenSource === '{"status":"invoice.pending"}'
                    ? 'green'
                    : props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
              },
            ]}>
            In mempool
          </Text>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  evenSource === '{"status":"invoice.pending"}'
                    ? 'green'
                    : props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
              },
            ]}>
            Payment Pending
          </Text>
        </View>
      </View>

      {/* <View style={styles.amountContainer}>
        <Text style={styles.valueAmountText}>
          {props.liquidAmount?.toLocaleString()} sat
        </Text>
      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '90%',
    height: 55,
    position: 'relative',
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 5,
    paddingRight: 10,
    borderRadius: 8,

    position: 'absolute',
    zIndex: 1,
    top: 7.5,
    left: 7.5,
  },
  labelText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Bold,
  },
  inputField: {
    width: '100%',
    height: '100%',
    textAlign: 'right',
    fontSize: SIZES.huge,
    fontFamily: FONT.Descriptoin_Regular,
  },
  feeContainer: {
    width: '90%',
    alignItems: 'flex-end',
    marginVertical: 20,
    paddingRight: 10,
  },
  feeRow: {
    flexDirection: 'row',
  },
  feeLabel: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Bold,
    marginRight: 10,
  },
  feeText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
  },

  createSwapBTN: {
    height: 40,
    width: 200,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    // overflow: "hidden",
    ...SHADOWS.medium,
    marginTop: 'auto',
    // marginBottom: 30,
  },
  buttonText: {
    fontFamily: FONT.Other_Regular,
    fontSize: SIZES.medium,
    color: COLORS.background,
  },

  qrcodeContainer: {
    width: '90%',
    maxWidth: 250,
    height: 250,
    ...CENTER,

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },

  transactionStatusContainer: {
    width: 220,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CENTER,
  },
  statusTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Bold,
  },
  statusText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
  },
});
