import {useRef, useEffect, useState} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BTN, COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../../constants';
import {CENTER, backArrow} from '../../../../constants/styles';
import {CameraType} from 'expo-camera';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import {useTheme} from '../../../../../context-store/context';
export default function InfoPopup(props) {
  const fadeAnim = useRef(new Animated.Value(900)).current;
  const {theme, toggleTheme} = useTheme();

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
  function fadeout() {
    Animated.timing(fadeAnim, {
      toValue: 900,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (props.isDisplayed) fadeIn();
    else fadeout();
  }, [props.isDisplayed]);

  return (
    <Animated.View
      style={[
        popupStyles.container,
        {
          transform: [{translateY: fadeAnim}],
        },
      ]}>
      <SafeAreaView style={popupStyles.innerContainer}>
        {props.type === 'btcCamera' && (
          <BTCCamera
            theme={theme}
            setBitcoinAddress={props.setBitcoinAddress}
            setDisplayPopup={props.setDisplayPopup}
          />
        )}
      </SafeAreaView>
    </Animated.View>
  );
}

function BTCCamera(props) {
  const type = CameraType.back;
  const [permission, setPermission] = useState(
    BarCodeScanner.getPermissionsAsync(),
  );
  const [bottomExpand, setBottomExpand] = useState(false);
  const [photoesPermission, setPhotoesPermission] = useState({});

  function toggleBottom() {
    setBottomExpand(prev => !prev);
  }

  async function getClipboardText() {
    try {
      const text = await Clipboard.getStringAsync();
      props.setBitcoinAddress(text);
      props.setDisplayPopup(prev => {
        return {
          ...prev,
          isDisplayed: false,
        };
      });
    } catch (err) {
      console.log(err);
    }
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

    props.setBitcoinAddress(data);
    props.setDisplayPopup(prev => {
      return {
        ...prev,
        isDisplayed: false,
      };
    });
  }

  useEffect(() => {
    (async () => {
      const status = await BarCodeScanner.requestPermissionsAsync();

      setPermission(status.granted);
    })();
  }, []);

  function handleBarCodeScanned({type, data}) {
    if (!type.includes('QRCode')) return;

    const bitcoinAdress = data;
    props.setBitcoinAddress(bitcoinAdress);
    props.setDisplayPopup(prev => {
      return {
        ...prev,
        isDisplayed: false,
      };
    });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        overflow: 'hidden',
        backgroundColor: props.theme
          ? COLORS.darkModeBackground
          : COLORS.lightModeBackground,
        borderRadius: 8,
      }}>
      <View style={btcCameraStyles.topBar}>
        <TouchableOpacity
          activeOpacity={1}
          style={{width: 20, height: '100%'}}
          onPress={() => {
            props.setDisplayPopup({
              isDisplayed: false,
              type: 'btcCamera',
            });
          }}>
          <Image
            source={ICONS.leftCheveronIcon}
            style={{width: 30, height: 30, marginRight: 'auto'}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style={[
            btcCameraStyles.headerText,
            {
              color: props.theme ? COLORS.darkModeText : COLORS.lightModeText,
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
          style={btcCameraStyles.camera}
        />
      )}

      <View
        style={{
          ...btcCameraStyles.bottomBar,
          height: bottomExpand ? 100 : 50,
          backgroundColor: props.theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        }}>
        <View
          onTouchEnd={toggleBottom}
          style={{
            ...btcCameraStyles.arrowIcon,
            backgroundColor: props.theme
              ? COLORS.darkModeBackground
              : COLORS.lightModeBackground,
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
              btcCameraStyles.bottomText,
              {
                color: props.theme ? COLORS.darkModeText : COLORS.lightModeText,
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
              btcCameraStyles.bottomText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Choose image
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const btcCameraStyles = StyleSheet.create({
  topBar: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: COLORS.black,
    fontSize: SIZES.large,
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
    top: -20,
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

const popupStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // top: 0,
    left: 0,

    backgroundColor: COLORS.opaicityGray,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  popupContentContainer: {
    width: '95%',
    height: 'auto',
    backgroundColor: COLORS.white,

    padding: 10,
    borderRadius: 8,
  },
});
