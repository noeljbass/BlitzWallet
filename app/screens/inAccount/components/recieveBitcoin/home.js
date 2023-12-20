import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import {
  BTN,
  CENTER,
  COLORS,
  FONT,
  ICONS,
  SIZES,
  SHADOWS,
} from '../../../../constants';

import {useEffect, useRef, useState} from 'react';

import EditAmountPopup from './editAmount';

import TopBar from './topBar';
import ButtonsContainer from './buttonsContainer';
import NavBar from './NavBar';
import LightningPage from './lightningPage';
import BitcoinPage from './bitcoinPage';
import LiquidPage from './liquidPage';

export function ReceivePaymentHome(props) {
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [sendingAmount, setSendingAmount] = useState({
    lightning: 1000,
    bitcoin: 1000,
    liquid: 2000,
  });
  const [paymentDescription, setPaymentDescription] = useState({
    lightning: '',
    bitcoin: '',
    liquid: '',
  });
  const [editPaymentPopup, setEditPaymentPopup] = useState(false);
  const [updateQRCode, setUpdateQRCode] = useState(0);
  const [selectedRecieveOption, setSelectedRecieveOption] =
    useState('lightning');

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    clear('navChange');
  }, [selectedRecieveOption]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}>
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        }}>
        <SafeAreaView style={{flex: 1}}>
          <TopBar clear={clear} />
          <Text
            style={[
              styles.title,
              {
                color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {selectedRecieveOption[0].toUpperCase() +
              selectedRecieveOption.slice(1)}
          </Text>

          <NavBar
            selectedRecieveOption={selectedRecieveOption}
            setSelectedRecieveOption={setSelectedRecieveOption}
          />

          {/*PAGES*/}
          <LightningPage
            selectedRecieveOption={selectedRecieveOption}
            sendingAmount={sendingAmount.lightning}
            updateQRCode={updateQRCode}
            isDisplayed={props.isDisplayed}
            generatedAddress={generatedAddress}
            paymentDescription={paymentDescription.lightning}
            setGeneratedAddress={setGeneratedAddress}
          />
          <BitcoinPage
            selectedRecieveOption={selectedRecieveOption}
            setGeneratedAddress={setGeneratedAddress}
            generatedAddress={generatedAddress}
          />
          <LiquidPage selectedRecieveOption={selectedRecieveOption} />

          <ButtonsContainer
            selectedRecieveOption={selectedRecieveOption}
            generatedAddress={generatedAddress}
            setEditPaymentPopup={setEditPaymentPopup}
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
    </Modal>
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
    props.setRecivePayment(false);
  }
}

const styles = StyleSheet.create({
  globalContainer: {
    height: '100%',
    width: '100%',
    flex: 1,

    backgroundColor: COLORS.background,

    position: 'relative',
  },

  title: {
    ...CENTER,
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.xLarge,
    marginBottom: 20,
  },
});
