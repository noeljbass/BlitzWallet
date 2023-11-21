import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { CENTER, SIZES, ICONS, COLORS, FONT } from "../../../constants";

import { useState, useEffect, useRef } from "react";

import { ConfirmPaymentAmount } from "./BitcoinPaymentPath/confirmAmout";

import { FullAdress } from "./BitcoinPaymentPath/fullAdress";
import { NetworkFee } from "./BitcoinPaymentPath/networkFee";
import { retrieveData } from "../../global/dataStorage";
import { getLocalStorageItem } from "../../global/localStorage";

export default function ConfirmBitcoinPath(props) {
  const [inputValue, setInputValue] = useState("");
  const [refreshNetworkFee, setRefreshNetworkFee] = useState(0);

  const [paymentProgression, setPaymentProgression] = useState([
    {
      isShown: true,
      name: "inputAmount",
    },
  ]);
  const [networkFee, setNetworkFee] = useState(0);
  const [displayAdress, setDisplayAdress] = useState(false);
  const enterAMTRef = useRef(null);
  const enterNoteRef = useRef(null);
  const [networkFeePopup, setNetworkFeePopup] = useState(false);

  async function sendtransaction() {
    const mnemonic = await retrieveData("key");
    let addressNum = await getLocalStorageItem("numAddresses");

    const URL = "http://192.168.0.102:8000/bitcoin/sendBitcoinTransaction";
    const requestData = {
      mnemonic: mnemonic,
      numAddresses: Number(addressNum),
      recipientAddress: props.BTCadress,
      paymentAmount: Number(inputValue.split(",").join("")),
      networkFee: Number(networkFee),
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
        window.alert("payment sent");
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity
          style={styles.backStyle}
          onPress={() => props.setScanned(false)}
        >
          <Text style={styles.backStyleText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topHeader}>Send Bitcoin</Text>
      </View>

      <View style={styles.sendingInfoContainer}>
        <Text style={styles.sendingInfoContainerTo}>To</Text>
        <View
          onTouchEnd={() => {
            Keyboard.dismiss();
            setDisplayAdress(true);
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ ...styles.toAddress }}>
            {props.BTCadress.slice(0, 5)}...
            {props.BTCadress.slice(props.BTCadress.length - 5)}
          </Text>
          <Image
            source={ICONS.EyeIcon}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </View>
      </View>
      <View
        style={{
          display: paymentProgression[0].isShown ? "none" : "flex",
          flexDirection: "column",
          borderBottomWidth: !paymentProgression[0].isShown ? 1 : 0,
        }}
      >
        <View
          style={{
            ...styles.sendingInfoContainer,
            borderTopWidth: 0,
            borderBottomWidth: paymentProgression[0].isShown ? 1 : 0,
          }}
        >
          <Text style={styles.sendingInfoContainerTo}>Amount</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: SIZES.medium }}>
              {Number(inputValue.split(",").join("")).toLocaleString("en-US") +
                " SAT"}
            </Text>
          </View>
        </View>

        <View
          style={{ display: paymentProgression[0].isShown ? "none" : "flex" }}
        >
          <View
            onTouchEnd={() => {
              setNetworkFeePopup(true);
              setRefreshNetworkFee((prev) => (prev += 1));
            }}
            style={{
              ...styles.sendingInfoContainer,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
          >
            <Text style={{ ...styles.sendingInfoContainerTo, marginRight: 10 }}>
              Network Fee
            </Text>
            <Image
              source={ICONS.editIcon}
              style={{ width: 20, height: 20, marginRight: "auto" }}
              resizeMode="contain"
            />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: SIZES.medium }}>
                {Number(networkFee).toLocaleString("en-US") + " SAT"}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...styles.sendingInfoContainer,
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
          >
            <Text
              style={{ ...styles.sendingInfoContainerTo, fontWeight: "bold" }}
            >
              Total
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: SIZES.medium }}>
                {(
                  Number(inputValue.split(",").join("")) + Number(networkFee)
                ).toLocaleString("en-US") + " SAT"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {paymentProgression[0].isShown && (
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.inputGlobalContainer}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {paymentProgression[0].isShown && (
                <ConfirmPaymentAmount
                  enterAMTRef={enterAMTRef}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  for={props.for}
                  setPaymentProgression={setPaymentProgression}
                  bitcoinAmount={props.bitcoinAmount}
                />
              )}
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}

      {!paymentProgression[0].isShown && (
        <TouchableOpacity
          style={{
            width: "90%",
            backgroundColor: COLORS.primary,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            ...CENTER,
            marginTop: "auto",
          }}
          onPress={() => {
            // props.refreshTransactions();
            sendtransaction();
          }}
        >
          <Text style={{ color: "white", fontSize: SIZES.medium }}>Send</Text>
        </TouchableOpacity>
      )}

      {/* popups */}
      {/* /////////////////////// */}

      <NetworkFee
        setNetworkFeePopup={setNetworkFeePopup}
        isDisplayed={networkFeePopup}
        setNetworkFee={setNetworkFee}
        refresh={refreshNetworkFee}
      />

      <FullAdress
        paymentProgression={paymentProgression}
        setDisplayAdress={setDisplayAdress}
        isDisplayed={displayAdress}
        address={props.BTCadress}
        amtRef={enterAMTRef}
        noteRef={enterNoteRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: COLORS.background,
    zIndex: 2,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
  },
  topHeader: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Bold,
    fontWeight: "bold",
    ...CENTER,
    transform: [{ translateX: -35 }],
  },

  backStyle: {
    width: 50,
    margin: 10,
  },
  backStyleText: {
    fontSize: SIZES.large,
    fontFamily: FONT.Descriptoin_Regular,
  },
  // adress container
  sendingInfoContainer: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: "2.5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...CENTER,

    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  sendingInfoContainerTo: {
    fontSize: SIZES.large,
    fontFamily: FONT.Descriptoin_Regular,
  },
  toAddress: {
    fontSize: SIZES.medium,
    marginRight: 10,
    fontFamily: FONT.Descriptoin_Regular,
  },

  // content container
  inputGlobalContainer: {
    flexGrow: 1,
  },
});
