import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {setStatusBarStyle} from 'expo-status-bar';
import {useGlobalContextProvider} from '../../../context-store/context';

export default function ExpandedTx(props) {
  console.log('Transaction Detials Page');
  const navigate = useNavigation();
  // const theme = props.route.params.theme;
  const {theme, toggleTheme} = useGlobalContextProvider();

  const [selectedTX] = props.route.params?.transactions?.filter(tx => {
    return props.route.params.txId === tx.details.data.paymentHash;
  });
  setStatusBarStyle('light');

  return (
    <View
      style={[
        styles.popupContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
          padding: 10,
        },
      ]}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            setStatusBarStyle(theme ? 'light' : 'dark');
            navigate.goBack();
          }}>
          <Image style={styles.backButton} source={ICONS.xSmallIcon} />
        </TouchableOpacity>
        <View style={styles.innerContainer}>
          {selectedTX.status === 'complete' ? (
            <Image style={styles.confirmedIocn} source={ICONS.Checkcircle} />
          ) : (
            <Image style={styles.confirmedIocn} source={ICONS.Xcircle} />
          )}
          <Text
            style={[
              styles.confirmText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {selectedTX.paymentType?.toLowerCase() === 'sent'
              ? 'Sent'
              : 'Received'}
          </Text>
          <Text
            style={[
              styles.dateText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {new Date(selectedTX.paymentTime * 1000).toLocaleString()}
          </Text>
          <Text
            style={[
              styles.amountText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {(selectedTX.amountMsat / 1000).toLocaleString()}
            <Text style={{color: COLORS.primary, fontFamily: FONT.Title_Bold}}>
              {' '}
              sat
            </Text>
          </Text>
          <View style={styles.seperator}></View>
          <Text
            style={[
              styles.descriptionText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {selectedTX.description && (
              <Text
                style={[
                  styles.feeText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                <Text style={styles.descriptor}>Desc</Text>{' '}
                {selectedTX.description.includes('bwrfd')
                  ? 'Faucet'
                  : selectedTX.description}
              </Text>
            )}
          </Text>
          <Text
            style={[
              styles.feeText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            <Text style={styles.descriptor}>Lightning Fees</Text>{' '}
            {(selectedTX.feeMsat / 1000).toLocaleString()}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
  },

  innerContainer: {
    flex: 1,
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },

  backButton: {
    width: 40,
    height: 40,
  },
  confirmedIocn: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
  confirmText: {
    fontSize: SIZES.huge,
    fontFamily: FONT.Title_Bold,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    fontSize: SIZES.medium,
    marginBottom: 50,
    fontFamily: FONT.Descriptoin_Regular,
  },
  amountText: {
    fontSize: SIZES.large,
    marginBottom: 40,
    fontFamily: FONT.Title_Bold,
  },
  seperator: {
    backgroundColor: COLORS.primary,
    width: 100,
    height: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: SIZES.medium,
    marginBottom: 10,
    fontFamily: FONT.Descriptoin_Regular,
  },
  feeText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
  },
  descriptor: {
    fontWeight: 'bold',
  },
});
