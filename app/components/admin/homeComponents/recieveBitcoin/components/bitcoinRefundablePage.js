import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useGlobalContextProvider} from '../../../../../../context-store/context';
import {CENTER, COLORS, FONT, ICONS, SIZES} from '../../../../../constants';
import {useEffect, useState} from 'react';
import {listRefundables} from '@breeztech/react-native-breez-sdk';
import {useNavigation} from '@react-navigation/native';

export default function RefundBitcoinTransactionPage() {
  const {theme} = useGlobalContextProvider();
  const navigate = useNavigation();
  const [refundableInfo, setRefundableInfo] = useState({});
  const [hasRefundableTx, setHasRefundableTx] = useState(null);
  const [lookingForTx, setLookingForTx] = useState(true);
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  console.log(bitcoinAddress);

  useEffect(() => {
    (async () => {
      try {
        const refundables = await listRefundables();
        if (refundables.length === 0) {
          setHasRefundableTx(false);
        } else {
          setRefundableInfo(refundables);
          hasRefundableTx(true);
        }
        setLookingForTx(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme
          ? COLORS.darkModeBackground
          : COLORS.lightModeBackground,
      }}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <SafeAreaView>
            <View style={styles.topbar}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  Keyboard.dismiss();
                  navigate.goBack();
                }}>
                <Image
                  source={ICONS.leftCheveronIcon}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.navText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                Refund Transaction
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigate.navigate('CameraModal', {
                  updateBitcoinAdressFunc: setBitcoinAddress,
                });
              }}>
              <Text>TESTING</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.large,
    ...CENTER,
    transform: [{translateX: -15}],
  },
});
