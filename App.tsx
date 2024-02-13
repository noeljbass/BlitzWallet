/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
// import {registerRootComponent} from 'expo';
type RootStackParamList = {
  Home: {someParam?: string};
  Details: {someParam?: string};
};

import {AppState, Platform} from 'react-native';
import {connectToNode, retrieveData} from './app/functions';
import SplashScreen from 'react-native-splash-screen';
import {
  CreateAccountHome,
  DislaimerPage,
  GenerateKey,
  PinSetupPage,
  SecuityOption,
  RestoreWallet,
  VerifyKey,
  RestoreWalletError,
} from './app/screens/createAccount';
import {
  AdminHome,
  AdminLogin,
  ConfirmTxPage,
  ConnectionToNode,
  ContactsPage,
  ExpandedTx,
  ReceivePaymentHome,
  SendPaymentHome,
  SettingsContentIndex,
  SettingsIndex,
  ViewAllTxPage,
} from './app/screens/inAccount';

import {setStatusBarHidden} from 'expo-status-bar';
import {
  GlobalContextProvider,
  useGlobalContextProvider,
} from './context-store/context';
import {
  ConfirmDrainPage,
  DrainWalletAddress,
  LspDescriptionPopup,
} from './app/components/admin/homeComponents/settingsContent';
import AmountToGift from './app/components/admin/homeComponents/fundGift/amountToGift';
import GiftWalletConfirmation from './app/components/admin/homeComponents/fundGift/popups/giftWalletConfirmation';
import SendPaymentScreen from './app/components/admin/homeComponents/sendBitcoin/sendPaymentScreen';
import ClipboardCopyPopup from './app/components/admin/homeComponents/recieveBitcoin/components/confirmClipboard';
import RefundBitcoinTransactionPage from './app/components/admin/homeComponents/recieveBitcoin/components/bitcoinRefundablePage';
import CameraModal from './app/components/admin/homeComponents/cameraModal';
import ScanRecieverQrCode from './app/components/admin/homeComponents/fundGift/scanReciverQrCode';

import ReceiveGiftHome from './app/screens/createAccount/receiveGift/receiveGiftHome';
import {
  FaucetHome,
  FaucetReceivePage,
  FaucetSettingsPage,
} from './app/components/admin/homeComponents/faucet';
import globalOnBreezEvent from './app/functions/globalOnBreezEvent';
import {listPayments} from '@breeztech/react-native-breez-sdk';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <GlobalContextProvider>
      <ResetStack />
    </GlobalContextProvider>
  );
}

function ResetStack(): JSX.Element | null {
  const navigationRef =
    useRef<NativeStackNavigationProp<RootStackParamList> | null>(null);
  const appState = useRef(AppState.currentState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isloaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const pin = await retrieveData('pin');
      const mnemonic = await retrieveData('mnemonic');

      if (pin && mnemonic) {
        setIsLoggedIn(true);
      } else setIsLoggedIn(false);
      setIsLoaded(true);

      if (Platform.OS === 'android') {
        SplashScreen.hide();
      }
      setStatusBarHidden(false, 'fade');
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log(nextAppState, 'HOME APP STATE');
      // if (appState.current.match(/background/) && nextAppState === 'active') {
      //   console.log('Background!');
      //   (async () => {
      //     const pin = await retrieveData('pin');
      //     const mnemonic = await retrieveData('mnemonic');

      //     if (pin && mnemonic) {
      //       setIsLoggedIn(true);
      //     } else setIsLoggedIn(false);

      //     navigationRef?.current?.navigate('Home', {fromBackground: true});
      //   })();
      // }

      appState.current = nextAppState;
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
          options={{animation: 'fade', gestureEnabled: false}}
        />
        {/* Create Account screens */}
        <Stack.Screen name="DisclaimerPage" component={DislaimerPage} />
        <Stack.Screen name="StartKeyGeneration" component={SecuityOption} />
        <Stack.Screen name="GenerateKey" component={GenerateKey} />
        <Stack.Screen name="VerifyKey" component={VerifyKey} />
        <Stack.Screen name="PinSetup" component={PinSetupPage} />
        <Stack.Screen name="RestoreWallet" component={RestoreWallet} />
        {/* gift walet path */}
        <Stack.Screen name="ReceiveGiftHome" component={ReceiveGiftHome} />
        {/* admin screens */}
        <Stack.Screen name="HomeAdmin" component={AdminHome} />
        <Stack.Group screenOptions={{animation: 'slide_from_bottom'}}>
          <Stack.Screen name="SendBTC" component={SendPaymentHome} />
          <Stack.Screen name="ReceiveBTC" component={ReceivePaymentHome} />
          <Stack.Group
            screenOptions={{presentation: 'modal', gestureEnabled: false}}>
            <Stack.Screen name="ExpandedTx" component={ExpandedTx} />
            <Stack.Screen name="ConfirmTxPage" component={ConfirmTxPage} />
          </Stack.Group>
          <Stack.Screen name="ContactsPage" component={ContactsPage} />
          <Stack.Screen name="ViewAllTxPage" component={ViewAllTxPage} />
          <Stack.Screen
            name="DrainWalletAddress"
            component={DrainWalletAddress}
          />
          <Stack.Screen name="CameraModal" component={CameraModal} />
          <Stack.Screen name="FaucetHome" component={FaucetHome} />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="SettingsHome" component={SettingsIndex} />
          <Stack.Screen
            name="SettingsContentHome"
            component={SettingsContentIndex}
          />
          <Stack.Screen
            name="ConfirmPaymentScreen"
            component={SendPaymentScreen}
          />

          {/* GIFT WALLET PATH */}
          <Stack.Screen name="AmountToGift" component={AmountToGift} />
          <Stack.Screen
            name="ScanReciverQrCode"
            component={ScanRecieverQrCode}
          />

          {/* REFUND TX  */}
          <Stack.Screen
            name="RefundBitcoinTransactionPage"
            component={RefundBitcoinTransactionPage}
          />

          {/* Faucet Pages  */}
          <Stack.Screen
            name="FaucetSettingsPage"
            component={FaucetSettingsPage}
          />
          <Stack.Screen
            name="RecieveFaucetPage"
            component={FaucetReceivePage}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            animation: 'fade',
            presentation: 'containedTransparentModal',
          }}>
          <Stack.Screen name="ConnectionToNode" component={ConnectionToNode} />
          <Stack.Screen
            name="RestoreWalletError"
            component={RestoreWalletError}
          />
          <Stack.Screen name="ConfirmDrainPage" component={ConfirmDrainPage} />

          <Stack.Screen
            name="GiftWalletConfirmation"
            component={GiftWalletConfirmation}
          />
          <Stack.Screen
            name="ClipboardCopyPopup"
            component={ClipboardCopyPopup}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            presentation: 'modal',
          }}>
          <Stack.Screen
            name="LspDescriptionPopup"
            component={LspDescriptionPopup}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  async ({data, error, executionInfo}) => {
    console.log(data);
    console.log(executionInfo);
    const paymentInformationFromNotification = data?.body;
    console.log(paymentInformationFromNotification);

    const didConnect = await connectToNode(globalOnBreezEvent);
    console.log(didConnect);
    if (didConnect.isConnected) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Blitz Wallet',
            body: `Caught incoming payment`,
          },
          trigger: null,
        });
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Blitz Wallet',
            body: 'Getting invoice details',
          },
          trigger: null,
        });
      } catch (err) {
        console.log(err);
      }
    }

    console.log('Received a notification in the background!', 'TTTTT');

    // Do something with the notification data
  },
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

export default App;
// registerRootComponent(App);
