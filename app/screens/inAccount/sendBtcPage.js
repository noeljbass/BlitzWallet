import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Platform,
} from 'react-native';
import * as ExpoCamera from 'expo-camera';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';

import {useEffect, useState} from 'react';

import {COLORS, FONT, ICONS, SIZES} from '../../constants';
import {useNavigation} from '@react-navigation/native';
import {useGlobalContextProvider} from '../../../context-store/context';

export default function SendPaymentHome() {
  console.log('SCREEN OPTIONS PAGE');
  const navigate = useNavigation();
  const type = ExpoCamera.CameraType.back;
  const {theme} = useGlobalContextProvider();
  const [storedCameraPermissions, requestCameraPermissions] =
    ExpoCamera.Camera.useCameraPermissions();
  const [storedPhotoesPermissions, requestPhotoesPermissions] =
    ImagePicker.useMediaLibraryPermissions();

  const [didScan, setDidScan] = useState(false);

  const [bottomExpand, setBottomExpand] = useState(false);

  useEffect(() => {
    setDidScan(false);
    (async () => {
      await requestCameraPermissions();
      await requestPhotoesPermissions();
    })();
  }, []);

  async function getClipboardText() {
    const data = await Clipboard.getStringAsync();
    if (!data) return;
    navigate.navigate('ConfirmPaymentScreen', {
      btcAdress: data,
      setDidScan: setDidScan,
    });
  }

  async function getQRImage() {
    if (!storedPhotoesPermissions.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) return;

    const imgURL = result.assets[0].uri;

    const [{data}] = await BarCodeScanner.scanFromURLAsync(imgURL);

    navigate.navigate('ConfirmPaymentScreen', {
      btcAdress: data,
      setDidScan: setDidScan,
    });
  }

  function handleBarCodeScanned({type, data}) {
    if (!type.includes('QRCode')) {
      return;
    }

    if (didScan) return;
    console.log('TETS');
    navigate.navigate('ConfirmPaymentScreen', {
      btcAdress: data,
      setDidScan: setDidScan,
    });
    setDidScan(true);
  }

  return (
    <View
      style={[
        styles.viewContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
          paddingTop: Platform.OS === 'ios' ? 0 : 5,
        },
      ]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={1}
            style={{width: 20, height: '100%'}}
            onPress={() => {
              navigate.goBack();
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
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Scan A QR code
          </Text>
        </View>

        {!storedCameraPermissions?.granted && (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: FONT.Title_Regular,
                fontSize: SIZES.large,
                marginBottom: 5,
              }}>
              No access to camera
            </Text>
            <Text
              style={{
                fontFamily: FONT.Title_Regular,
                fontSize: SIZES.medium,
                textAlign: 'center',
              }}>
              Go to settings to let Blitz Wallet access your camera
            </Text>
          </View>
        )}
        {storedCameraPermissions?.granted && (
          <ExpoCamera.Camera
            type={type}
            onBarCodeScanned={handleBarCodeScanned}
            style={[styles.camera]}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
            focusDepth={1}
            autoFocus={ExpoCamera.AutoFocus.on}
          />
        )}

        <View
          style={{
            ...styles.bottomBar,
            height: bottomExpand ? 100 : 50,
            backgroundColor: theme
              ? COLORS.darkModeBackground
              : COLORS.lightModeBackground,
            borderTopColor: theme ? COLORS.darkModeText : COLORS.lightModeText,
            borderTopWidth: 2,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setBottomExpand(prev => !prev);
            }}>
            <View
              style={{
                ...styles.arrowIcon,
                backgroundColor: theme
                  ? COLORS.darkModeBackground
                  : COLORS.lightModeBackground,

                borderColor: theme ? COLORS.darkModeText : COLORS.lightModeText,
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
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={getClipboardText}
            style={{backgroundColor: 'transparent'}}
            activeOpacity={0.2}>
            <Text
              style={[
                styles.bottomText,
                {
                  color: theme ? COLORS.darkModeText : COLORS.lightModeText,
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
                  color: theme ? COLORS.darkModeText : COLORS.lightModeText,
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
    alignItems: 'center',
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
