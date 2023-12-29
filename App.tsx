/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
// import {registerRootComponent} from 'expo';

import {AppState, Platform} from 'react-native';

import {CreateAccountHome, DislaimerPage} from './app/screens/createAccount';

import SecuityOption from './app/screens/createAccount/keySetup/start';
import GenerateKey from './app/screens/createAccount/keySetup/generateKey';
import VerifyKey from './app/screens/createAccount/keySetup/verifyKey';
import PinSetupPage from './app/screens/createAccount/keySetup/pin';
import AdminHome from './app/screens/inAccount/home';
import {retrieveData, userAuth} from './app/functions';
import AdminLogin from './app/screens/inAccount/login';
import SplashScreen from 'react-native-splash-screen';
import RestoreWallet from './app/screens/createAccount/restoreWallet/home';
import SendPaymentHome from './app/screens/inAccount/sendBTC';
import {ReceivePaymentHome} from './app/screens/inAccount/receiveBTC';
import {ConnectionToNode} from './app/screens/inAccount/conectionToNode';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log('refresh');

    (async () => {
      const pin = await retrieveData('pin');
      const mnemonic = await retrieveData('mnemonic');
      if (pin && mnemonic) setIsLoggedIn(true);
      else setIsLoggedIn(false);
    })();

    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive/) && nextAppState === 'background') {
        console.log('Background!');
        // NAVIGATE TO HOME PAGE

        // SplashScreen.show();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  console.log('TEST');

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
        {/* <Stack.Screen name="CreateAccountHome" component={CreateAccountHome} /> */}
        {/* <Stack.Screen name="AdminLogin" component={AdminLogin} /> */}
        <Stack.Screen name="DisclaimerPage" component={DislaimerPage} />
        <Stack.Screen name="StartKeyGeneration" component={SecuityOption} />
        <Stack.Screen name="GenerateKey" component={GenerateKey} />
        <Stack.Screen name="VerifyKey" component={VerifyKey} />
        <Stack.Screen name="PinSetup" component={PinSetupPage} />
        <Stack.Screen name="RestoreWallet" component={RestoreWallet} />
        {/* admin screens */}
        <Stack.Screen name="HomeAdmin" component={AdminHome} />
        <Stack.Screen
          options={{animation: 'slide_from_bottom'}}
          name="SendBTC"
          component={SendPaymentHome}
        />
        <Stack.Screen
          options={{animation: 'slide_from_bottom'}}
          name="ReceiveBTC"
          component={ReceivePaymentHome}
        />
        <Stack.Screen
          options={{
            animation: 'fade',
            presentation: 'containedTransparentModal',
          }}
          name="ConnectionToNode"
          component={ConnectionToNode}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
// registerRootComponent(App);
