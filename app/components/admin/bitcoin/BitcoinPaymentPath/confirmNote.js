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

export function ConfirmNote(props) {
  return (
    <>
      <TextInput
        ref={props.enterNoteRef}
        style={styles.input}
        placeholder="Write a note"
        keyboardType="default"
        autoFocus={true} // Use boolean value, not a string
        value={props.note ? props.note : ""}
        onChangeText={props.setNote}
      />

      <TouchableOpacity
        onPress={() => {
          props.setPaymentProgression((prev) => {
            return prev.map((item) => {
              return { ...item, isShown: false };
            });
          });
        }}
        style={{
          ...styles.confirmButton,
          opacity: props.note ? 1 : 0.6,
        }}
      >
        <Text style={styles.confirmNote}>confirm note</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "90%",
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
    flex: 1,
  },
  confirmNote: {
    color: "white",
    fontSize: SIZES.medium,
    textTransform: "uppercase",
    fontFamily: FONT.Other_Regular,
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
  },
});
