import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CENTER, COLORS, FONT, SIZES } from "../../../../constants";
const SATCONSTANT = 100000000;

export function LightningPaymentPage(props) {
  console.log(props.lnInformation);
  const fields = props.lnInformation.fields;
  return (
    <View style={{ ...styles.container }}>
      <View style={styles.top}>
        <TouchableOpacity
          style={styles.backStyle}
          onPress={() => props.setScanned(false)}
        >
          <Text style={styles.backStyleText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topHeader}>Send Lightning Payment</Text>
      </View>
      <View style={{ ...styles.amoutContainer }}>
        <Text
          style={{
            fontSize: SIZES.xxLarge,
            marginRight: 10,
            fontFamily: FONT.Title_Regular,
          }}
        >
          {(Number(props.lnInformation.amount) * SATCONSTANT).toLocaleString()}
        </Text>
        <Text style={{ fontFamily: FONT.Title_Regular }}>SAT</Text>
      </View>
      {/* <Text>= 1.38usd</Text> */}
      <View style={styles.note}>
        <Text style={{ fontFamily: FONT.Title_Bold }}>Note</Text>
        <Text style={{ fontFamily: FONT.Descriptoin_Regular }}>
          {fields ? fields[1].value : ""}
        </Text>
      </View>

      <TouchableOpacity style={{ marginBottom: "auto" }} activeOpacity={0.5}>
        <Text style={{ ...styles.payBTN }}>Pay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,

    backgroundColor: "white",
  },
  top: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "auto",
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
    fontFamily: FONT.Other_Regular,
  },
  amoutContainer: {
    width: 160,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    borderBottomWidth: 1,
    paddingBottom: 5,

    ...CENTER,
  },
  note: {
    alignItems: "center",
    ...CENTER,
    marginBottom: 50,
    marginTop: 10,
  },

  payBTN: {
    backgroundColor: COLORS.primary,
    width: 150,
    textAlign: "center",
    paddingVertical: 10,
    color: COLORS.lightWhite,
    borderRadius: 15,
    overflow: "hidden",
    fontSize: SIZES.large,
    ...CENTER,
    fontFamily: FONT.Other_Regular,
  },
});
