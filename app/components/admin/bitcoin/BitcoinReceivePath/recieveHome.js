import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  Modal,
} from "react-native";
import {
  BTN,
  CENTER,
  COLORS,
  FONT,
  ICONS,
  SIZES,
  SHADOWS,
} from "../../../../constants";
import QRCode from "react-native-qrcode-svg";
import { useEffect, useState } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../../global/localStorage";
import { retrieveData } from "../../../global/dataStorage";
import * as Clipboard from "expo-clipboard";
import { FullAdress } from "./fullAddress";
import * as Device from "expo-device";

// import * as Sharing from "expo-sharing";

export function ReceivePaymentHome(props) {
  const [generatedAddress, setGeneratedAddress] = useState("");
  const [fullAddressView, setFullAddressView] = useState(false);
  //   const canShare = Sharing.isAvailableAsync()["_j"];
  const deviceType = Device.brand;

  async function copyToClipboard() {
    await Clipboard.setStringAsync(generatedAddress);
    window.alert("Text Copied to Clipboard");
  }

  async function openShareOptions() {
    try {
      await Share.share({
        message: generatedAddress,
      });
    } catch {
      window.alert("ERROR with sharing");
    }
  }

  useEffect(() => {
    if (props.for === "lightning") {
      console.log("WORKING");
    } else {
      getAddress(setGeneratedAddress);
    }
  }, [props.isDisplayed]);
  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}
    >
      <View
        style={[
          { paddingTop: deviceType === "Apple" ? 55 : 0 },
          styles.globalContainer,
        ]}
      >
        <View style={styles.topbar}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              props.setRecivePayment(false);
            }}
          >
            <Image
              source={ICONS.leftCheveronIcon}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.navText}>Receive</Text>
        </View>
        <Text style={styles.title}>Bitcoin</Text>
        <View style={styles.qrcode}>
          <QRCode
            style={styles.qrcode}
            size={300}
            value={generatedAddress ? generatedAddress : "TESTING"}
          />
        </View>
        <View
          onTouchEnd={() => setFullAddressView(true)}
          style={styles.bitcoinAddressContainer}
        >
          <Text style={styles.generatedBTCaddress}>
            {generatedAddress.slice(0, 32) + "..."}
          </Text>
          <Image
            source={ICONS.EyeIcon}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={openShareOptions}
            style={[styles.buttonsOpacity]}
          >
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={copyToClipboard}
            style={[styles.buttonsOpacity]}
          >
            <Text style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* popups */}
        <FullAdress
          isDisplayed={fullAddressView}
          setDisplayAdress={setFullAddressView}
          address={generatedAddress}
        />
      </View>
    </Modal>
  );
}
async function getAddress(setGeneratedAddress) {
  const mnemonic = await retrieveData("key");
  let addressNum = await getLocalStorageItem("numAddresses");
  console.log(mnemonic);

  if (addressNum) {
    const numify = Number(addressNum) + 1;

    addressNum = 0;
  } else addressNum = 0;

  const URL = "http://192.168.0.102:8000/bitcoin/generateAddress";
  const requestData = {
    mnemonic: mnemonic,
    numAddresses: addressNum,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(requestData),
    headers: {
      "Content-type": "application/json",
    },
  };
  fetch(URL, options)
    .then((response) => response.json())
    .then((data) => {
      setGeneratedAddress(data);
      setLocalStorageItem("numAddresses", String(addressNum));
    });
}

const styles = StyleSheet.create({
  globalContainer: {
    height: "100%",
    width: "100%",
    flex: 1,

    backgroundColor: COLORS.background,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
  },
  navText: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    ...CENTER,
    transform: [{ translateX: -15 }],
  },
  title: {
    ...CENTER,
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.xLarge,
    marginTop: 15,
  },
  qrcode: {
    width: "90%",
    maxWidth: 300,
    height: 300,
    aspectRatio: 1,
    backgroundColor: "black",

    ...CENTER,
    marginVertical: 20,
  },
  bitcoinAddressContainer: {
    width: 300,
    ...CENTER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  generatedBTCaddress: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
  },

  buttonsContainer: {
    width: 300,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    ...CENTER,
    marginTop: "auto",
    marginBottom: 40,
  },
  buttonsOpacity: {
    height: "100%",
    width: 130,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    // overflow: "hidden",
    ...SHADOWS.medium,
  },
  buttonText: {
    fontFamily: FONT.Other_Regular,
    fontSize: SIZES.medium,
    color: "white",
  },
});
