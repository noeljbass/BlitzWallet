import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Modal,
} from 'react-native';
import {CameraType} from 'expo-camera';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';

import {useEffect, useState} from 'react';

import {COLORS, FONT, ICONS, SIZES} from '../../../../constants';

// import {ManualAddressInput} from './manualAddressInput';

export default function SendPaymentHome(props) {
  const type = CameraType.back;
  const [permission, setPermission] = useState(
    BarCodeScanner.getPermissionsAsync(),
  );
  const [scanned, setScanned] = useState(false);
  const [bottomExpand, setBottomExpand] = useState(false);
  const [BTCadress, setBTCadress] = useState('');
  const [photoesPermission, setPhotoesPermission] = useState({});

  const [manualBitcoinInput, setManualBitcoinInput] = useState('');
  const [showManualInpt, setShowManualInput] = useState(false);

  console.log(photoesPermission);
  function toggleBottom() {
    setBottomExpand(prev => !prev);
  }

  async function getClipboardText() {
    const text = await Clipboard.getStringAsync();
    setBTCadress(text);
    setScanned(true);
  }
  async function getQRImage() {
    if (!photoesPermission) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) return;

    const imgURL = result.assets[0].uri;

    const [{data}] = await BarCodeScanner.scanFromURLAsync(imgURL);

    setBTCadress(data);
    setScanned(true);
  }

  useEffect(() => {
    (async () => {
      const status = await BarCodeScanner.requestPermissionsAsync();

      setPermission(status.granted);
    })();
  }, []);

  function getManualInput() {
    if (!manualBitcoinInput) return;
    // add validation
    setBTCadress(manualBitcoinInput);
    setScanned(true);
  }

  function toggleManualInput() {
    setShowManualInput(prev => !prev);
    setBottomExpand(false);
  }

  function handleBarCodeScanned({type, data}) {
    if (!type.includes('QRCode')) {
      setScanned(false);
      return;
    }

    setScanned(true);
    const bitcoinAdress = data;
    setBTCadress(data);

    console.log(bitcoinAdress);
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}>
      <View style={styles.cameraContainer}>
        <View style={styles.topBar}>
          <Text
            style={{width: 20, height: '100%'}}
            onPress={() => {
              setBTCadress('');
              setScanned(false);
              props.setSendPayment(false);
            }}>
            <Image
              source={ICONS.leftCheveronIcon}
              style={{width: 30, height: 30, marginRight: 'auto'}}
              resizeMode="contain"
            />
          </Text>
          <Text style={styles.headerText}>Scan A QR code</Text>
        </View>

        {!permission && <Text>No access to camera</Text>}
        {permission && !scanned && (
          <BarCodeScanner
            type={type}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.camera}
          />
        )}
        <View
          onTouchEnd={toggleBottom}
          style={{...styles.arrowIcon, bottom: bottomExpand ? 150 : 50}}>
          <Image
            source={ICONS.angleUpIcon}
            style={{
              width: 30,
              height: 20,
              transform: bottomExpand
                ? [{rotate: '180deg'}]
                : [{rotate: '0deg'}],
            }}
            resizeMode="contain"
          />
        </View>

        <View style={{...styles.bottomBar, height: bottomExpand ? 150 : 50}}>
          <TouchableOpacity
            onPress={getClipboardText}
            style={{backgroundColor: 'transparent'}}
            activeOpacity={0.2}>
            <Text style={styles.bottomText}>Paste from clipbard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={getQRImage}
            style={{backgroundColor: 'transparent'}}
            activeOpacity={0.2}>
            <Text style={styles.bottomText}>Choose image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleManualInput}
            style={{backgroundColor: 'transparent'}}
            activeOpacity={0.2}>
            <Text style={styles.bottomText}>Manual input</Text>
          </TouchableOpacity>
        </View>

        {/* <ManualAddressInput
        for={props.for}
        getManualInput={getManualInput}
        isDisplayed={showManualInpt}
        toggleManualInput={toggleManualInput}
        setManualBitcoinInput={setManualBitcoinInput}
      /> */}

        {scanned && props.for === 'bitcoin' && (
          <ConfirmBitcoinPath
            for={props.for}
            setScanned={setScanned}
            BTCadress={BTCadress}
            refreshTransactions={props.refreshTransactions}
            bitcoinAmount={props.bitcoinAmount}
          />
        )}
        {scanned && props.for === 'lightning' && (
          <ConfirmLightningPath
            for={props.for}
            setScanned={setScanned}
            BTCadress={BTCadress}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',

    backgroundColor: COLORS.background,
    zIndex: 5,
    display: 'flex',
    paddingTop: 50,
  },
  topBar: {
    width: '100%',
    padding: 10,

    flexDirection: 'row',
  },
  headerText: {
    color: 'black',
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginRight: 'auto',
    marginLeft: 'auto',
    fontFamily: FONT.Title_Bold,
  },
  camera: {flex: 1},
  bottomBar: {
    width: '100%',
    height: 50,

    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'white',
  },
  bottomText: {
    width: '100%',
    textAlign: 'center',
    color: 'black',
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: 'transparent',
    fontFamily: FONT.Other_Bold,

    lineHeight: 50,
  },
  arrowIcon: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    zIndex: 1,
    transform: [{translateX: -40}],
    color: 'white',
    backgroundColor: 'white',
    paddingVertical: 2,
    paddingHorizontal: 20,
    alignItems: 'center',

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
});
