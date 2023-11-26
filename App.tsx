/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  AppState,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {CreateAccountHome, DislaimerPage} from './app/screens/createAccount';
import {COLORS} from './app/constants';
import SecuityOption from './app/screens/createAccount/keySetup/start';
import GenerateKey from './app/screens/createAccount/keySetup/generateKey';
import VerifyKey from './app/screens/createAccount/keySetup/verifyKey';
import PinSetupPage from './app/screens/createAccount/keySetup/pin';
import AdminHome from './app/screens/inAccount/home';
import {retrieveData, userAuth} from './app/functions';
import AdminLogin from './app/screens/inAccount/components/login';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const appState = useRef(AppState.currentState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    console.log(appState);
    console.log('refresh');
    (async () => {
      const hasAccount = await retrieveData('pin');
      if (hasAccount) setIsLoggedIn(true);
      else setIsLoggedIn(false);
    })();
  }, [appState]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Home"
          component={isLoggedIn ? AdminLogin : CreateAccountHome}
        />
        <Stack.Screen name="DisclaimerPage" component={DislaimerPage} />
        <Stack.Screen name="StartKeyGeneration" component={SecuityOption} />
        <Stack.Screen name="GenerateKey" component={GenerateKey} />
        <Stack.Screen name="VerifyKey" component={VerifyKey} />
        <Stack.Screen name="PinSetup" component={PinSetupPage} />
        <Stack.Screen name="HomeAdmin" component={AdminHome} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
