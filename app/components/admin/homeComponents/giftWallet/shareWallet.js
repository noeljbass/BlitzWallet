import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {COLORS, FONT, SIZES, ICONS} from '../../../../constants';
import {useGlobalContextProvider} from '../../../../../context-store/context';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import connectToNode from '../../../../functions/giftWallet/createWallet';

export default function ShareWallet(props) {
  const {theme} = useGlobalContextProvider();
  const navigation = useNavigation();
  const [breezEvent, setBreezEvent] = useState({});
  const [walletCreationPath, setWalletCreationPath] = useState({
    creatingWallet: true,
    fundingWallet: false,
    showSeed: false,
  });
  function onBreezEvent(e) {
    setBreezEvent(e);
  }
  const amount = props.route.params.walletAmount;

  useEffect(() => {
    (async () => {
      const walletInfo = await connectToNode(onBreezEvent);
    })();
  }, []);

  return (
    <View
      style={[
        styles.globalContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
          paddingVertical: Platform.OS === 'ios' ? 0 : 10,
        },
      ]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topbar}>
          <TouchableOpacity
            onPress={() => {
              props.route.params.wantsToCreateWallet(false);
              navigation.goBack();
            }}>
            <Image style={styles.topBarIcon} source={ICONS.leftCheveronIcon} />
          </TouchableOpacity>
          <Text
            style={[
              styles.topBarText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Share Wallet
          </Text>
        </View>
        <View style={styles.contentContainer}>
          {(walletCreationPath.creatingWallet ||
            walletCreationPath.fundingWallet) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={theme ? COLORS.darkModeText : COLORS.lightModeText}
              />
              <Text
                style={[
                  styles.loadingText,
                  {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
                ]}>
                {walletCreationPath.creatingWallet
                  ? 'Creating Wallet'
                  : 'Funding Wallet'}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarIcon: {
    width: 25,
    height: 25,
  },

  topBarText: {
    fontSize: SIZES.large,
    marginRight: 'auto',
    marginLeft: 'auto',
    transform: [{translateX: -12.5}],
    fontFamily: FONT.Title_Bold,
  },

  contentContainer: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.Title_Bold,
    marginTop: 10,
  },
});
