import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { CENTER, COLORS, FONT, ICONS, SIZES } from "../../constants";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";

export function ExpandedTransaction(props) {
  const transaction = props.transactions[props.expandTransaction.txPos];
  const [currentBlockHeight, setCurrentBlockheight] = useState(0);

  useEffect(() => {
    const URL = "https://mempool.space/testnet/api/blocks/tip/height";
    fetch(URL)
      .then((response) => response.json())
      .then((data) => setCurrentBlockheight(Number(data)));
  }, [props.expandTransaction]);

  async function copyToClipboard(data) {
    const wasCoppied = await Clipboard.setStringAsync(data);
    if (!wasCoppied) return;
    window.alert("Copied Successful");
  }

  if (!transaction) return;
  async function openExternalLink(url) {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error(`Cannot open URL: ${url}`);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  }

  return (
    <View
      style={{
        ...styles.container,
        top: props.expandTransaction.isDisplayed ? 0 : "120%",
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            props.setExpandtransaction({ txPos: null, isDisplayed: false });
          }}
          style={{ width: 30, height: 30 }}
          activeOpacity={1}
        >
          <Image
            source={ICONS.smallArrowLeft}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.HeaderText}>Payment Detail</Text>
      </View>
      <Text style={styles.mainDescription}>You received</Text>
      <Text style={styles.amount}>
        {Number(transaction.amount).toLocaleString()} SATS
      </Text>

      <Text
        style={{
          ...styles.confirmText,
          color: transaction.completed ? "green" : COLORS.primary,
        }}
      >
        {transaction.completed ? "Confirmed" : "Pending"}
      </Text>
      {/* or not confirmed depending on prop */}

      {props.transactions.completed && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoDescription}>When</Text>
          <Text style={styles.infoText}>{transaction.date}</Text>
        </View>
      )}
      <View
        style={{
          ...styles.infoContainer,
          borderBottomWidth: !transaction.wasSent ? 1 : 0,
          paddingBottom: !transaction.wasSent ? 30 : 0,
        }}
      >
        <Text style={styles.infoDescription}>Amount</Text>
        <Text style={styles.infoText}>
          {Number(transaction.amount).toLocaleString()} SATS
        </Text>
      </View>
      {transaction.wasSent && (
        <View
          style={{
            ...styles.infoContainer,
            borderBottomWidth: 1,
            paddingBottom: 30,
          }}
        >
          <Text style={styles.infoDescription}>Fee</Text>
          <Text style={styles.infoText}>
            {Number(transaction.fee).toLocaleString()} SATS
          </Text>
        </View>
      )}

      {/* once confirmed */}
      {transaction.completed && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoDescription}>Confirmations</Text>
          <Text style={styles.infoText}>
            {Math.abs(currentBlockHeight - transaction.blockHeight) === 0
              ? "1"
              : Math.abs(currentBlockHeight - transaction.blockHeight) > 6
              ? "6+"
              : Math.abs(currentBlockHeight - transaction.blockHeight)}
          </Text>
        </View>
      )}
      {/* based on current block height - block tx was in */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoDescription}>Recived in address</Text>
        <TouchableOpacity
          onPress={() => {
            openExternalLink(
              `https://mempool.space/testnet/address/${transaction.address}`
            );
          }}
          onLongPress={() => {
            copyToClipboard(transaction.address);
          }}
        >
          <Text style={styles.infoText}>{transaction.address}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoDescription}>Transaction ID</Text>
        <TouchableOpacity
          onPress={() => {
            openExternalLink(
              `https://mempool.space/testnet/tx/${transaction.txid}`
            );
          }}
          onLongPress={() => {
            console.log("TEWT");
            copyToClipboard(transaction.txid);
          }}
        >
          <Text style={styles.infoText}>{transaction.txid}</Text>
        </TouchableOpacity>
      </View>
      {/* both txid and address take you to mempool.space */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",

    backgroundColor: "white",
    position: "absolute",

    left: 0,
    zIndex: 3,
  },
  header: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,

    ...CENTER,
  },
  HeaderText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Medium,
    ...CENTER,
    transform: [{ translateX: -12 }],
  },
  mainDescription: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONT.Title_Light,
    ...CENTER,
    opacity: 0.4,
    marginBottom: 10,
  },
  amount: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.Title_Regular,
    ...CENTER,

    marginBottom: 60,
  },

  confirmText: {
    width: "90%",
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
    ...CENTER,
    marginBottom: 30,
  },

  infoContainer: {
    width: "90%",

    ...CENTER,
    marginBottom: 20,
  },
  infoDescription: {
    fontFamily: FONT.Title_Medium,
    fontSize: SIZES.medium,
    marginBottom: 5,
  },
});
