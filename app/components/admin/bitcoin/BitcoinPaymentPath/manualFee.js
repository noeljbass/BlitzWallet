import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { ICONS, SIZES, COLORS, CENTER, FONT } from "../../../../constants";
import { useState } from "react";

export function ManualFee(props) {
  const [inputValue, setInputValue] = useState("");

  function confirmNetworkFee() {
    if (Number(inputValue) < props.minfee * props.transationWeight) return;
    props.setActiveSpeed((prev) => {
      return prev.map((speed, id) => {
        if (id === 4) {
          return { ...speed, amount: inputValue, isSelected: true };
        } else return { ...speed, isSelected: false };
      });
    });
    props.setDisplayManualFee(false);
    props.setNetworkFee(inputValue);
    props.setNetworkFeePopup(false);
    Keyboard.dismiss();
  }
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
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                height: "100%",
                width: "90%",
                ...CENTER,
              }}
            >
              <View
                onTouchEnd={() => {
                  props.setDisplayManualFee(false);
                  Keyboard.dismiss();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 50,
                }}
              >
                <Image
                  source={ICONS.smallArrowLeft}
                  style={{ width: 30, height: 30, marginRight: "auto" }}
                  resizeMode="contain"
                />
                <Text style={styles.header}>Edit network fee</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  justifyContent: "center",
                }}
              >
                <TextInput
                  style={styles.number}
                  placeholder="0"
                  autoFocus={true}
                  keyboardType="numeric"
                  value={inputValue ? inputValue : ""}
                  onChangeText={setInputValue}
                />
                <Text style={styles.satTxt}>sat/vbyte</Text>
              </View>

              <TouchableOpacity
                onPress={confirmNetworkFee}
                style={{
                  position: "absolute",
                  bottom: 60,
                  left: 0,
                  width: "100%",
                  opacity:
                    Number(inputValue) < props.minfee * props.transationWeight
                      ? 0.3
                      : 1,
                }}
              >
                <Text
                  style={{
                    ...styles.button,
                  }}
                >
                  Confirm fee
                </Text>
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
    height: "100%",
    width: "100%",
    position: "absolute",
    left: 0,
    zIndex: 3,
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: "hidden",
  },
  header: {
    marginRight: "auto",
    transform: [{ translateX: -15 }],
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Bold,
  },
  number: { fontSize: SIZES.huge, marginRight: 4, fontFamily: FONT.Title_Bold },
  satTxt: { fontSize: SIZES.medium, fontFamily: FONT.Descriptoin_Regular },
  button: {
    width: "100%",
    height: 50,
    lineHeight: 50,
    borderRadius: 5,
    textAlign: "center",
    fontSize: SIZES.medium,
    color: "white",
    textTransform: "uppercase",
    backgroundColor: COLORS.primary,
    fontFamily: FONT.Other_Regular,
  },
});
