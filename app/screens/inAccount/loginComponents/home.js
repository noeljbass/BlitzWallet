import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {BTN, COLORS, FONT, ICONS, SIZES} from '../../../constants';
import * as Device from 'expo-device';
import * as LocalAuthentication from 'expo-local-authentication';
import {useEffect, useRef, useState} from 'react';

export default function HomeLogin(props) {
  const {height} = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(height / 2 - 150)).current;

  function moveLogo(type) {
    Animated.timing(fadeAnim, {
      toValue: type === 'up' ? 20 : height / 2 - 150,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    (async () => {
      const canUseFaceID = await hasHardware();
      if (canUseFaceID) {
        const hasProfile = await hasSavedProfile();
        if (hasProfile) {
          moveLogo('up');
          const didLogIn = await handleLogin();
          if (didLogIn) {
            moveLogo('down');
            props.navigation.replace('HomeAdmin');
          } else props.setDidUsePin(true);
        } else {
          Alert.alert(
            'Biometric record not found',
            'Please verify your identity with your password',
            [{text: 'Ok', onPress: () => props.setDidUsePin(true)}],
          );
        }
      } else {
        Alert.alert(
          'Device does not support Biometric login',
          'Please verify your identity with your password',
          [{text: 'Ok', onPress: () => props.setDidUsePin(true)}],
        );
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[styles.logo, {transform: [{translateY: fadeAnim}]}]}
        source={ICONS.transparentIcon}
      />
      <TouchableOpacity
        style={[
          BTN,
          {backgroundColor: COLORS.primary, marginTop: 0, marginBottom: 15},
        ]}>
        <Text style={styles.btnText}>Use Pin</Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.appName,
          {
            color: props.isDarkMode
              ? COLORS.darkModeText
              : COLORS.lightModeText,
            marginBottom: Device.osName === 'Android' ? 15 : 0,
          },
        ]}>
        Blitz Wallet
      </Text>
    </View>
  );

  async function hasHardware() {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      return new Promise(resolve => {
        resolve(compatible);
      });
    } catch (err) {
      console.log(err);
      return new Promise(resolve => {
        resolve(false);
      });
    }
  }
  async function hasSavedProfile() {
    try {
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

      return new Promise(resolve => {
        resolve(savedBiometrics);
      });
    } catch (err) {
      return new Promise(resolve => {
        resolve(false);
      });
    }
  }
  async function handleLogin() {
    const LocalAuthenticationOptions = {
      promptMessage: 'Face ID',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
      fallbackLabel: 'Login with pin',
    };
    try {
      const didAuthenticate = await LocalAuthentication.authenticateAsync(
        LocalAuthenticationOptions,
      );

      return new Promise(resolve => {
        resolve(didAuthenticate.success);
      });
    } catch (err) {
      return new Promise(resolve => {
        resolve(false);
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  logo: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 0,
  },
  btnText: {
    color: COLORS.lightModeBackground,
    fontSize: SIZES.medium,
    fontFamily: FONT.Other_Regular,
  },
  appName: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.Title_Bold,
  },
});
