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

export default function SettingsContent(props) {
  const fadeAnim = useRef(new Animated.Value(600)).current;
  const [displayPopup, setDisplayPopup] = useState({
    isDisplayed: false,
    type: '',
    variable: null,
  });
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

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
          backgroundColor: isDarkMode
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView>
        <View style={styles.topbar}>
          <TouchableOpacity
            onPress={() =>
              props.setSettingsContent({isDisplayed: false, for: null})
            }>
            <Image
              style={[
                styles.topBarIcon,
                {backgroundColor: isDarkMode ? COLORS.white : COLORS.black},
              ]}
              source={ICONS.leftCheveronIcon}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.topBarText,
              {color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText},
            ]}>
            {props.for}
          </Text>
        </View>
      </SafeAreaView>
      <View style={{flex: 1}}>
        {props.for?.toLowerCase() === 'about' && <AboutPage />}
        {props.for?.toLowerCase() === 'recovery phrase' && (
          <RecoveryPage setSettingsContent={props.setSettingsContent} />
        )}
        {props.for?.toLowerCase() === 'fiat currency' && (
          <FiatCurrencyPage setSettingsContent={props.setSettingsContent} />
        )}
        {props.for?.toLowerCase() === 'node info' && <NodeInfo />}
        {props.for?.toLowerCase() === 'lsp' && (
          <LSPPage setDisplayPopup={setDisplayPopup} />
        )}
        {props.for?.toLowerCase() === 'reset wallet' && <ResetPage />}
        {props.for?.toLowerCase() === 'drain wallet' && (
          <DrainPage
            setBitcoinAddress={setBitcoinAddress}
            bitcoinAddress={bitcoinAddress}
            setDisplayPopup={setDisplayPopup}
          />
        )}
      </View>
      <InfoPopup
        setDisplayPopup={setDisplayPopup}
        {...displayPopup}
        setBitcoinAddress={setBitcoinAddress}
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
