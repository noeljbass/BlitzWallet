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
import {OptionsDropdown} from './optionsDropdown';
import SystemSettings from './settings';
import {FaucetHome} from './faucet';

export default function NavBar(props) {
  console.log('NAV BAR PAGE');
  const [navViews, setNavViews] = useState({
    features: false,
  });
  // const props. = useColorScheme() === 'dark';
  const [systemSettingsPopup, setSystemSettingsPopup] = useState(false);
  const [fucet, setFaucet] = useState(false);

  return (
    <View style={styles.topBar}>
      <Text
        style={[
          styles.topBarName,
          {
            color: props.isDarkMode
              ? COLORS.darkModeText
              : COLORS.lightModeText,
          },
        ]}>
        Blitz Wallet
      </Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => props.setNodeConnectionPopup(false)}
          style={{
            ...styles.icons,
            backgroundColor: props.breezInformation.didConnectToNode
              ? 'green'
              : 'red',
          }}>
          <Image style={styles.imgIcon} source={ICONS.connectionIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSystemSettingsPopup(true);
          }}
          activeOpacity={0.5}
          style={styles.icons}>
          <Image style={styles.imgIcon} source={ICONS.settingsIcon} />
        </TouchableOpacity>
        <View style={styles.icons}></View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.icons}
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
        />
      </View>
      <SystemSettings
        isDisplayed={systemSettingsPopup}
        setSystemSettingsPopup={setSystemSettingsPopup}
        isDarkMode={props.isDarkMode}
        setIsDarkMode={props.setIsDarkMode}
      />
      <FaucetHome
        breezEvent={props.breezEvent}
        setFaucet={setFaucet}
        isDisplayed={fucet}
        isDarkMode={props.isDarkMode}
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
    width: 170,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icons: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  imgIcon: {
    width: 15,
    height: 15,
  },
});
