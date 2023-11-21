import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { SIZES, COLORS, FONT } from "../../../../constants";

export function ConfirmPaymentAmount(props) {
  function FillInputValue() {
    props.setInputValue(props.bitcoinAmount);
  }
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="0"
          ref={props.enterAMTRef}
          keyboardType="numeric"
          autoFocus={true} // Use boolean value, not a string
          value={
            props.inputValue
              ? Number(props.inputValue.split(",").join("")).toLocaleString(
                  "en-US"
                )
              : ""
          }
          onChangeText={props.setInputValue}
        />
        <Text
          style={[
            styles.satText,
            {
              color: props.inputValue ? "black" : COLORS.gray,
            },
          ]}
        >
          SAT
        </Text>
      </View>
      <Text style={styles.balanceText}>
        Balance: {Number(props.bitcoinAmount).toLocaleString("us-EN")} SAT
      </Text>
      <TouchableOpacity onPress={FillInputValue} style={styles.useFundsButton}>
        <Text style={{ color: COLORS.primary }}>Use all funds</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (Number(props.inputValue.split(",").join("")) < 1000) return;
          props.setPaymentProgression((prev) => {
            return prev.map((item, index) => {
              if (index === 0) {
                return { ...item, isShown: false };
              } else if (index === 1) {
                return { ...item, isShown: true };
              } else return item;
            });
          });
        }}
        style={{
          ...styles.confirmButton,
          opacity:
            props.for === "bitcoin"
              ? Number(props.inputValue.split(",").join("")) < 1000
                ? 0.6
                : 1
              : props.inputValue
              ? 1
              : 0.6,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: SIZES.medium,
            textTransform: "uppercase",
          }}
        >
          confirm amount
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: SIZES.huge,
    fontFamily: FONT.Title_Bold,
    marginRight: 10,
    marginBottom: 5,
  },
  satText: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Bold,
  },
  balanceText: {
    marginBottom: 20,
    fontFamily: FONT.Descriptoin_Regular,
  },
  useFundsButton: {
    marginBottom: 10,
    fontFamily: FONT.Descriptoin_Regular,
  },
  confirmButton: {
    position: "absolute",
    height: 50,
    bottom: 60, // Positioned at the bottom of the screen
    width: "90%",
    maxWidth: 335,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    fontFamily: FONT.Other_Regular,
  },
});
