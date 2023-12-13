import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../../constants';
import {getSwapPairInformation} from '../../../../functions/LBTC';

export default function LiquidPage(props) {
  const [liquidAmount, setLiquidAmount] = useState('1000');
  const [lightningAmount, setLightningAmount] = useState('1000');
  const [feeInfo, setFeeInfo] = useState({
    boltzFeePercent: 0,
    liquidFee: 0,
  });

  useEffect(() => {
    if (props.selectedRecieveOption != 'liquid') return;

    (async () => {
      const swapInfo = await getSwapPairInformation();
      setFeeInfo({
        boltzFeePercent: swapInfo.fees.percentageSwapIn / 100,
        liquidFee: swapInfo.fees.minerFees.baseAsset?.normal,
      });
      console.log(swapInfo.fees);
    })();

    // generateSwapAddress();
  }, [props.selectedRecieveOption]);

  console.log(feeInfo);
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
        }}>
        <View style={[styles.inputContainer, {marginTop: 'auto'}]}>
          <View style={styles.labelContainer}>
            <Image
              style={{width: 30, height: 30, marginRight: 5}}
              source={ICONS.liquidIcon}
            />
            <Text style={styles.labelText}>Liquid</Text>
          </View>

          <TextInput
            style={styles.inputField}
            keyboardType="number-pad"
            onChangeText={setLiquidAmount}
            value={liquidAmount}
          />
        </View>
        <View style={styles.feeContainer}>
          <View style={[styles.feeRow, {marginBottom: 5}]}>
            <Text style={styles.feeLabel}>Network Fee</Text>
            <Text style={styles.feeText}>{feeInfo.liquidFee}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Boltz Fee (0.1%)</Text>
            <Text style={styles.feeText}>
              {feeInfo.boltzFeePercent * liquidAmount}
            </Text>
          </View>
        </View>
        <View style={[styles.inputContainer, {backgroundColor: COLORS.gray}]}>
          <View style={styles.labelContainer}>
            <Image
              style={{width: 30, height: 30, marginRight: 5}}
              source={ICONS.lightningIcon}
            />
            <Text style={styles.labelText}>Lightning</Text>
          </View>

          <Text style={styles.inputField}>
            {liquidAmount -
              feeInfo.liquidFee -
              liquidAmount * feeInfo.boltzFeePercent}
          </Text>
        </View>
        <TouchableOpacity style={styles.createSwapBTN}>
          <Text style={styles.buttonText}>Create swap</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 30,
  },
  buttonText: {
    fontFamily: FONT.Other_Regular,
    fontSize: SIZES.medium,
    color: COLORS.background,
  },
});
