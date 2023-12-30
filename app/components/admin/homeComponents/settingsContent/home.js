import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES} from '../../../../constants';

import AboutPage from './about';
import RecoveryPage from './recoveryPhrase';
import FiatCurrencyPage from './fiatCurrency';
import NodeInfo from './nodeInfo';
import LSPPage from './lsp';
import InfoPopup from './popupContainer';
import ResetPage from './resetWallet';
import DrainPage from './drainPage';
import DisplayOptions from './displayOptions';

export default function SettingsContent(props) {
  const fadeAnim = useRef(new Animated.Value(600)).current;
  const [displayPopup, setDisplayPopup] = useState({
    isDisplayed: false,
    type: '',
    variable: null,
  });
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  // const props.isDarkMode = useColorScheme() === 'dark';

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
  function fadeOut() {
    Animated.timing(fadeAnim, {
      toValue: 600,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (props.isDisplayed) fadeIn();
    else fadeOut();
  }, [props.isDisplayed]);

  return (
    <Animated.View
      style={[
        styles.globalContainer,
        {
          transform: [{translateX: fadeAnim}],
          backgroundColor: props.isDarkMode
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topbar}>
          <TouchableOpacity
            onPress={() =>
              props.setSettingsContent({isDisplayed: false, for: null})
            }>
            <Image style={styles.topBarIcon} source={ICONS.leftCheveronIcon} />
          </TouchableOpacity>
          <Text
            style={[
              styles.topBarText,
              {
                color: props.isDarkMode
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            {props.for}
          </Text>
        </View>

        {/* <View style={{flex: 1}}> */}
        {props.for?.toLowerCase() === 'about' && (
          <AboutPage isDarkMode={props.isDarkMode} />
        )}

        {props.for?.toLowerCase() === 'fiat currency' && (
          <FiatCurrencyPage
            isDarkMode={props.isDarkMode}
            setSettingsContent={props.setSettingsContent}
          />
        )}
        {props.for?.toLowerCase() === 'node info' && (
          <NodeInfo isDarkMode={props.isDarkMode} />
        )}
        {props.for?.toLowerCase() === 'display options' && (
          <DisplayOptions
            setIsDarkMode={props.setIsDarkMode}
            isDarkMode={props.isDarkMode}
          />
        )}
        {props.for?.toLowerCase() === 'recovery phrase' && (
          <RecoveryPage
            isDarkMode={props.isDarkMode}
            setSettingsContent={props.setSettingsContent}
          />
        )}
        {props.for?.toLowerCase() === 'lsp' && (
          <LSPPage
            isDarkMode={props.isDarkMode}
            setDisplayPopup={setDisplayPopup}
          />
        )}
        {props.for?.toLowerCase() === 'reset wallet' && (
          <ResetPage
            breezInformation={props.breezInformation}
            isDarkMode={props.isDarkMode}
          />
        )}
        {props.for?.toLowerCase() === 'drain wallet' && (
          <DrainPage
            setBitcoinAddress={setBitcoinAddress}
            bitcoinAddress={bitcoinAddress}
            setDisplayPopup={setDisplayPopup}
            isDarkMode={props.isDarkMode}
            breezInformation={props.breezInformation}
          />
        )}
        {/* </View> */}
      </SafeAreaView>
      <InfoPopup
        setDisplayPopup={setDisplayPopup}
        {...displayPopup}
        setBitcoinAddress={setBitcoinAddress}
        isDarkMode={props.isDarkMode}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: COLORS.background,
    zIndex: 2,
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.background,
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
});