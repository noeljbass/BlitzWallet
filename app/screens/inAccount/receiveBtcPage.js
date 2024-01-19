import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {CENTER, FONT, COLORS, SIZES} from '../../constants';
import {useEffect, useRef, useState} from 'react';
import {
  BitcoinPage,
  ButtonsContainer,
  EditAmountPopup,
  LightningPage,
  LiquidPage,
  NavBar,
  TopBar,
} from '../../components/admin/homeComponents/recieveBitcoin';
import {useNavigation} from '@react-navigation/native';
import * as Device from 'expo-device';

import {getLocalStorageItem} from '../../functions';

export function ReceivePaymentHome(props) {
  const isInitialRender = useRef(true);
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [sendingAmount, setSendingAmount] = useState({
    lightning: 1000,
    bitcoin: 1000,
    liquid: 2000,
  });
  const [paymentDescription, setPaymentDescription] = useState({
    lightning: '',
    // bitcoin: '',
    liquid: '',
  });
  const [editPaymentPopup, setEditPaymentPopup] = useState(false);
  const [updateQRCode, setUpdateQRCode] = useState(0);
  const [selectedRecieveOption, setSelectedRecieveOption] =
    useState('lightning');
  const [isSwapCreated, setIsSwapCreated] = useState(false);
  const navigate = useNavigation();
  const isDarkMode = props.route.params.isDarkMode;
  const [userSelectedCurrency, setUserSelectedCurrency] = useState('');

  useEffect(() => {
    if (isInitialRender.current) {
      (async () => {
        try {
          const currency = await getLocalStorageItem('currency');
          setUserSelectedCurrency(currency);
        } catch (err) {
          console.log(err);
        }
      })();
      isInitialRender.current = false;
    }
    clear('navChange');
  }, [selectedRecieveOption]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? COLORS.darkModeBackground
          : COLORS.lightModeBackground,
        paddingVertical: Device.osName === 'ios' ? 0 : 10,
      }}>
      <KeyboardAvoidingView
        behavior={Device.osName === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={{flex: 1}}>
            <SafeAreaView style={{flex: 1}}>
              <TopBar isDarkMode={isDarkMode} clear={clear} />
              <Text
                style={[
                  styles.title,
                  {
                    color: isDarkMode
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                {selectedRecieveOption[0].toUpperCase() +
                  selectedRecieveOption.slice(1)}
              </Text>

              <NavBar
                selectedRecieveOption={selectedRecieveOption}
                setSelectedRecieveOption={setSelectedRecieveOption}
                isDarkMode={isDarkMode}
              />

              {/*PAGES*/}
              {selectedRecieveOption === 'lightning' && (
                <LightningPage
                  selectedRecieveOption={selectedRecieveOption}
                  sendingAmount={sendingAmount.lightning}
                  updateQRCode={updateQRCode}
                  generatedAddress={generatedAddress}
                  paymentDescription={paymentDescription.lightning}
                  setGeneratedAddress={setGeneratedAddress}
                  isDarkMode={isDarkMode}
                  userSelectedCurrency={userSelectedCurrency}
                />
              )}
              {selectedRecieveOption === 'bitcoin' && (
                <BitcoinPage
                  selectedRecieveOption={selectedRecieveOption}
                  setGeneratedAddress={setGeneratedAddress}
                  generatedAddress={generatedAddress}
                  isDarkMode={isDarkMode}
                />
              )}
              {selectedRecieveOption === 'liquid' && (
                <LiquidPage
                  selectedRecieveOption={selectedRecieveOption}
                  isDarkMode={isDarkMode}
                  setIsSwapCreated={setIsSwapCreated}
                  setGeneratedAddress={setGeneratedAddress}
                  generatedAddress={generatedAddress}
                />
              )}

              <ButtonsContainer
                selectedRecieveOption={selectedRecieveOption}
                generatedAddress={generatedAddress}
                setEditPaymentPopup={setEditPaymentPopup}
                isSwapCreated={isSwapCreated}
              />

              {/* popups */}
            </SafeAreaView>

            <EditAmountPopup
              type={selectedRecieveOption}
              setSendingAmount={setSendingAmount}
              setPaymentDescription={setPaymentDescription}
              isDisplayed={editPaymentPopup}
              setIsDisplayed={setEditPaymentPopup}
              setUpdateQRCode={setUpdateQRCode}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );

  function clear(type) {
    setSendingAmount({
      lightning: 1000,
      bitcoin: 1000,
      liquid: 2000,
    });
    setPaymentDescription({
      lightning: '',
      bitcoin: '',
      liquid: '',
    });
    setGeneratedAddress('');

    if (type === 'navChange') return;
    setEditPaymentPopup(false);
    navigate.goBack();
  }
}

const styles = StyleSheet.create({
  title: {
    ...CENTER,
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.xLarge,
    marginBottom: 20,
  },
});
