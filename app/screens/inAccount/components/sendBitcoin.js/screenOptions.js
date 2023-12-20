import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Modal,
  SafeAreaView,
  Animated,
  useColorScheme,
} from 'react-native';
import {CameraType} from 'expo-camera';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';

import {useEffect, useState} from 'react';

import {COLORS, FONT, ICONS, SIZES} from '../../../../constants';

// import {ManualAddressInput} from './manualAddressInput';

export default function SendPaymentScreenOptions(props) {
  console.log('SCREEN OPTIONS PAGE');
  const type = CameraType.back;
  const [permission, setPermission] = useState(
    BarCodeScanner.getPermissionsAsync(),
  );
  // const [scanned, setScanned] = useState(false);
  const [bottomExpand, setBottomExpand] = useState(false);
  // const [BTCadress, setBTCadress] = useState('');
  const [photoesPermission, setPhotoesPermission] = useState({});

  const [manualBitcoinInput, setManualBitcoinInput] = useState('');
  const [showManualInpt, setShowManualInput] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  function toggleBottom() {
    setBottomExpand(prev => !prev);
  }

  async function getClipboardText() {
    const text = await Clipboard.getStringAsync();
    if (!text) return;
    props.setBTCadress(text);
    props.setScanned(true);
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

    props.setBTCadress(data);
    props.setScanned(true);
  }

  useEffect(() => {
    (async () => {
      const status = await BarCodeScanner.requestPermissionsAsync();

      setPermission(status.granted);
    })();
  }, []);

  // function getManualInput() {
  //   if (!manualBitcoinInput) return;
  //   // add validation
  //   props.setBTCadress(manualBitcoinInput);
  //   props.setScanned(true);
  // }

  // function toggleManualInput() {
  //   setShowManualInput(prev => !prev);
  //   setBottomExpand(false);
  // }

  function handleBarCodeScanned({type, data}) {
    if (!type.includes('QRCode')) {
      props.setScanned(false);
      return;
    }

    props.setScanned(true);
    const bitcoinAdress = data;
    props.setBTCadress(data);

    console.log(bitcoinAdress);
  }

  return (
    <View
      style={[
        styles.viewContainer,
        {
          backgroundColor: isDarkMode
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={1}
            style={{width: 20, height: '100%'}}
            onPress={() => {
              props.setSendPayment(false);
            }}>
            <Image
              source={ICONS.leftCheveronIcon}
              style={{width: 30, height: 30, marginRight: 'auto'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerText,
              {
                color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Scan A QR code
          </Text>
        </View>

        {!permission && <Text>No access to camera</Text>}
        {permission && (
          <BarCodeScanner
            type={type}
            onBarCodeScanned={handleBarCodeScanned}
            style={styles.camera}
          />
        )}

        <View
          style={{
            ...styles.bottomBar,
            height: bottomExpand ? 100 : 50,
            backgroundColor: isDarkMode
              ? COLORS.darkModeBackground
              : COLORS.lightModeBackground,
            borderTopColor: isDarkMode
              ? COLORS.darkModeText
              : COLORS.lightModeText,
            borderTopWidth: 2,
          }}>
          <View
            onTouchEnd={toggleBottom}
            style={{
              ...styles.arrowIcon,
              backgroundColor: isDarkMode
                ? COLORS.darkModeBackground
                : COLORS.lightModeBackground,

              borderColor: isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderRightWidth: 2,
            }}>
            <Animated.Image
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
            <Image />
          </View>
          <TouchableOpacity
            onPress={getClipboardText}
            style={{backgroundColor: 'transparent'}}
            activeOpacity={0.2}>
            <Text
              style={[
                styles.bottomText,
                {
                  color: isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              Paste from clipbard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={getQRImage}
            style={{backgroundColor: 'transparent'}}
            activeOpacity={0.2}>
            <Text
              style={[
                styles.bottomText,
                {
                  color: isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              Choose image
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={toggleManualInput}
            style={{backgroundColor: 'transparent'}}
            activeOpacity={0.2}>
            <Text style={styles.bottomText}>Manual input</Text>
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',

    backgroundColor: COLORS.background,
    zIndex: 5,
    display: 'flex',
    // paddingTop: 50,
  },
  topBar: {
    width: '100%',

    paddingBottom: 10,
    flexDirection: 'row',
  },
  headerText: {
    color: 'black',
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginRight: 'auto',
    marginLeft: 'auto',
    fontFamily: FONT.Title_Bold,
    transform: [{translateX: -10}],
  },
  camera: {flex: 1},
  bottomBar: {
    width: '100%',
    height: 50,

    // overflow: 'hidden',
    position: 'absolute',
    bottom: 10,
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
    bottom: '100%',
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
