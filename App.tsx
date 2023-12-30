/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
// import {registerRootComponent} from 'expo';
type RootStackParamList = {
  Home: {someParam?: string};
  Details: {someParam?: string};
};
import {AppState, Platform} from 'react-native';
import {retrieveData} from './app/functions';
import SplashScreen from 'react-native-splash-screen';
import {
  CreateAccountHome,
  DislaimerPage,
  GenerateKey,
  PinSetupPage,
  SecuityOption,
  RestoreWallet,
  VerifyKey,
} from './app/screens/createAccount';
import {
  AdminHome,
  AdminLogin,
  ConfirmTxPage,
  ConnectionToNode,
  ExpandedTx,
  ReceivePaymentHome,
  SendPaymentHome,
} from './app/screens/inAccount';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return <ResetStack />;
}

function ResetStack(): JSX.Element | null {
  const navigationRef =
    useRef<NativeStackNavigationProp<RootStackParamList> | null>(null);
  const appState = useRef(AppState.currentState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isloaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('refresh');

    (async () => {
      const pin = await retrieveData('pin');
      const mnemonic = await retrieveData('mnemonic');
      if (pin && mnemonic) setIsLoggedIn(true);
      else setIsLoggedIn(false);
      setIsLoaded(true);

      if (Platform.OS === 'android') {
        SplashScreen.hide();
      }
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/background/) && nextAppState === 'active') {
        console.log('Background!');
        // NAVIGATE TO HOME PAGE
        navigationRef?.current?.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });

        // SplashScreen.show();
      }

      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  if (!isloaded) return null;
  return (
    <NavigationContainer ref={navigationRef}>
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
        <Stack.Group screenOptions={{animation: 'slide_from_bottom'}}>
          <Stack.Screen name="SendBTC" component={SendPaymentHome} />
          <Stack.Screen name="ReceiveBTC" component={ReceivePaymentHome} />
          <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen name="ExpandedTx" component={ExpandedTx} />
            <Stack.Screen name="ConfirmTxPage" component={ConfirmTxPage} />
          </Stack.Group>
        </Stack.Group>
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
