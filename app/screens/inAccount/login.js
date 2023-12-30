import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {
  getLocalStorageItem,
  retrieveData,
  setColorScheme,
  terminateAccount,
} from '../../functions';
import {COLORS, FONT, SIZES} from '../../constants';
import PinPage from '../../components/admin/loginComponents/pinPage';
import HomeLogin from '../../components/admin/loginComponents/home';

export default function AdminLogin({navigation}) {
  const hookDarkMode = useColorScheme() === 'dark';
  const [isDarkMode, setIsDarkMode] = useState(hookDarkMode);
  const [didUsePin, setDidUsePin] = useState(false);

  useEffect(() => {
    (async () => {
      const setStyle = await setColorScheme();
      if (setStyle) setIsDarkMode(setStyle);
    })();
  }, [hookDarkMode]);
  return (
    <View
      style={[
        styles.globalContainer,
        {
          backgroundColor: isDarkMode
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView style={styles.globalContainer}>
        {didUsePin && (
          <PinPage navigation={navigation} isDarkMode={isDarkMode} />
        )}
        {!didUsePin && (
          <HomeLogin
            navigation={navigation}
            isDarkMode={isDarkMode}
            setDidUsePin={setDidUsePin}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
});
