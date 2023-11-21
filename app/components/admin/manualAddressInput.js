import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import { useEffect, useState } from "react";

export function ManualAddressInput(props) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => {
      setIsKeyboardVisible(true);
    });
    Keyboard.addListener("keyboardWillHide", () => {
      setIsKeyboardVisible(false);
    });
  }, []);

  return (
    <View
      style={{
        ...styles.globalContainer,
        top: props.isDisplayed ? 0 : "120%",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              flex: 1,
              position: "absolute",
              padding: 20,
              bottom: isKeyboardVisible ? 47 : 0,
              left: 0,
            }}
          >
            <Text
              style={{
                ...styles.titleStyle,
              }}
            >
              Manual Input
            </Text>
            {props.for === "bitcoin" && (
              <Text style={{ ...styles.descriptionText }}>
                Enter a bitcoin adress that you want to send money to.
              </Text>
            )}
            {props.for === "lightning" && (
              <Text style={{ ...styles.descriptionText }}>
                Enter a lightning invoice, LNURL, or lightning address that you
                want to send money to.
              </Text>
            )}
            <TextInput
              style={{
                width: "100%",
                height: 35,
                marginVertical: 20,
                borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 10,
              }}
              onChangeText={props.setManualBitcoinInput}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  props.toggleManualInput();
                }}
              >
                <Text style={{ ...styles.CTA_BTNS, marginRight: 10 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.getManualInput();
                  props.toggleManualInput();
                  Keyboard.dismiss();
                }}
              >
                <Text style={{ ...styles.CTA_BTNS }}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    zIndex: 5,
    backgroundColor: COLORS.opaicityGray,
  },
  titleStyle: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    fontFamily: FONT.Title_Bold,
  },
  descriptionText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
    marginTop: 10,
  },

  CTA_BTNS: {
    fontSize: SIZES.medium,
    textTransform: "uppercase",
    fontFamily: FONT.Other_Regular,
  },
});
