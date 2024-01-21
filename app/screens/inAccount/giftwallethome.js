import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useGlobalContextProvider} from '../../../context-store/context';
import {BTN, COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../constants';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';

export default function GiftWalletHome() {
  const navigate = useNavigation();
  const {theme} = useGlobalContextProvider();
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
              navigate.goBack();
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
            Gift a Wallet
          </Text>
        </View>

        <View style={[styles.contentContainer]}>
          <View style={[styles.contentItem]}>
            <Text
              style={[
                styles.contentHeader,
                {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
              ]}>
              What is this?
            </Text>
            <View
              style={[
                styles.contentDescriptionContainer,
                {
                  backgroundColor: theme
                    ? COLORS.darkModeBackgroundOffset
                    : COLORS.lightModeBackgroundOffset,
                },
              ]}>
              <Text
                style={[
                  styles.contentDescription,
                  {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
                ]}>
                Non-custodial lightning can be intimidating at first. What are
                channels? How do I restore my wallet if I get a new phone? How
                do I set up my account? All of these questions are valid and
                pain points for people.
              </Text>
              <Text
                style={[
                  styles.contentDescription,
                  {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
                ]}>
                Here at Blitz, we believe in easing the transition to
                non-custodial lighting. And because of our passion for that, we
                created the gift-a-wallet feature.
              </Text>
              <Text
                style={[
                  styles.contentDescription,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    marginBottom: 0,
                  },
                ]}>
                By using this feature, you can invite people into the lightning
                ecosystem by giving them pre-stocked wallets so that when they
                restore their account, they can send and receive Bitcoin over
                the lightning network instantly.
              </Text>
            </View>
          </View>
          <View style={[styles.contentItem]}>
            <Text
              style={[
                styles.contentHeader,
                {color: theme ? COLORS.darkModeText : COLORS.lightModeText},
              ]}>
              Importent to know?
            </Text>
            <View
              style={[
                styles.contentDescriptionContainer,
                {
                  backgroundColor: theme
                    ? COLORS.darkModeBackgroundOffset
                    : COLORS.lightModeBackgroundOffset,
                },
              ]}>
              <Text
                style={[
                  styles.contentDescription,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                    marginBottom: 0,
                  },
                ]}>
                This feature is{' '}
                <Text style={{color: COLORS.primary}}>TRUST-BASED </Text> . You
                will be exposed to the seed phrase for the other person, so the
                security of the seed is on you. You should give a warning that
                using a seed somebody else knows is{' '}
                <Text style={{color: COLORS.primary}}>DANGEROUS</Text>.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              (async () => {
                try {
                  // await nodeInfo();
                  navigate.navigate('AmountToGift');
                } catch (err) {
                  Alert.alert(
                    'Not connected to node',
                    'Please connect to node to start this process',
                  );
                }
              })();
            }}
            style={[
              BTN,
              {
                backgroundColor: COLORS.primary,
                marginTop: 'auto',
                marginBottom: 0,
              },
            ]}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  contentItem: {
    width: '90%',
    marginVertical: 10,
  },
  contentHeader: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
  contentDescriptionContainer: {
    padding: 10,
    borderRadius: 8,
  },
  contentDescription: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },

  buttonText: {
    color: COLORS.white,
    fontFamily: FONT.Other_Regular,
  },
});
