import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import {CENTER, COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../constants';
import {useState} from 'react';
import {OptionsDropdown} from './navBar/optionsDropdown';
import {FaucetHome} from './faucet';
import {useNavigation} from '@react-navigation/native';

export default function NavBar(props) {
  console.log('NAV BAR PAGE');
  const [navViews, setNavViews] = useState({
    features: false,
  });
  const [fucet, setFaucet] = useState(false);
  const navigate = useNavigation();

  return (
    <View style={styles.topBar}>
      <Image source={ICONS.wordmark} style={{width: 150, height: 17}} />
      {/* <Text
        style={[
          styles.topBarName,
          {
            color: props.theme ? COLORS.darkModeText : COLORS.lightModeText,
          },
        ]}>
        Blitz Wallet
      </Text> */}
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() =>
            navigate.navigate('ConnectionToNode', {
              isDarkMode: props.theme,
            })
          }
          style={{
            ...styles.icons,
            backgroundColor: props.breezInformation.didConnectToNode
              ? COLORS.connectedNodeColor
              : COLORS.notConnectedNodeColor,
          }}>
          <Image style={styles.imgIcon} source={ICONS.connectionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigate.navigate('ViewAllTxPage', {
              breezInformation: props.breezInformation,
            });
          }}
          activeOpacity={0.5}
          style={[
            styles.icons,
            {
              backgroundColor: props.theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset,
            },
          ]}>
          <Image style={styles.imgIcon} source={ICONS.receiptIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            navigate.navigate('ContactsPage', {
              isDarkMode: props.theme,
            });
          }}
          activeOpacity={0.5}
          style={[
            styles.icons,
            {
              backgroundColor: props.theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset,
            },
          ]}>
          <Image style={styles.imgIcon} source={ICONS.contactsIcon} />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            navigate.navigate('SettingsHome');
          }}
          activeOpacity={0.5}
          style={[
            styles.icons,
            {
              backgroundColor: props.theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset,
            },
          ]}>
          <Image style={styles.imgIcon} source={ICONS.settingsIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.icons,
            {
              backgroundColor: props.theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset,
            },
          ]}
          activeOpacity={0.5}
          onPress={() => {
            setNavViews(prev => {
              return {...prev, features: !prev.features};
            });
          }}>
          <Image style={styles.imgIcon} source={ICONS.toolsIcon} />
        </TouchableOpacity>

        <OptionsDropdown
          setNavViews={setNavViews}
          isDisplayed={navViews.features}
          setFaucet={setFaucet}
          isDarkMode={props.theme}
        />
      </View>

      <FaucetHome
        breezEvent={props.breezEvent}
        setFaucet={setFaucet}
        isDisplayed={fucet}
        isDarkMode={props.theme}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  //   topBar
  topBar: {
    width: '90%',
    height: 50,
    display: 'flex',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CENTER,
    zIndex: 1,
  },
  topBarName: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Bold,
  },
  iconContainer: {
    width: 165,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icons: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  imgIcon: {
    width: 15,
    height: 15,
  },
});
