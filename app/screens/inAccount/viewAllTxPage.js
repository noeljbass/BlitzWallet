import {useNavigation} from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CENTER, COLORS, FONT, SIZES} from '../../constants';
import icons from '../../constants/icons';
import {UserTransactions} from '../../components/admin/homeComponents/homeLightning/userTransactions';
import {useGlobalContextProvider} from '../../../context-store/context';
import {useEffect, useState} from 'react';
import {getLocalStorageItem} from '../../functions';

export default function ViewAllTxPage(props) {
  const breezInformation = props.route.params.breezInformation;
  const navigate = useNavigation();
  const {theme} = useGlobalContextProvider();
  const [showAmount, setShowAmount] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const displayAmount = JSON.parse(
        await getLocalStorageItem('showBalance'),
      );

      if (displayAmount != null) {
        setShowAmount(displayAmount);
      } else setShowAmount(true);
      setIsLoaded(true);
    })();
  }, []);

  if (!isLoaded) return null;
  return (
    <View
      style={[
        styles.globalContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView style={styles.globalContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => {
              navigate.goBack();
            }}>
            <Image style={styles.backButton} source={icons.xSmallIcon} />
          </TouchableOpacity>
          <Text
            style={[
              styles.mainHeader,
              {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
            ]}>
            Transactions
          </Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('This does not work yet!');
            }}>
            <Text
              style={[
                styles.shareText,
                {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
              ]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>

        <UserTransactions
          transactions={breezInformation.transactions}
          theme={theme}
          showAmount={showAmount}
          numTx={'all'}
          from={'viewAll'}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
  topBar: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...CENTER,
    marginBottom: 10,
  },
  mainHeader: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.large,
  },
  shareText: {
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.medium,
  },
  backButton: {
    width: 40,
    height: 40,
  },
});
