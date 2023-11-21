import { View, Text, Keyboard, StyleSheet } from "react-native";
import { CENTER, COLORS, FONT, SIZES } from "../../../../constants";

export function FullAdress(props) {
  return (
    <View
      onTouchEnd={() => {
        props.setDisplayAdress(false);
      }}
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.opaicityGray,
        position: "absolute",
        top: props.isDisplayed ? 0 : "110%",
        left: 0,
        zIndex: 3,
      }}
    >
      <View
        style={{
          height: 150,
          width: "100%",
          backgroundColor: "white",
          marginTop: "auto",
          padding: 20,
          opacity: 1,
        }}
      >
        <Text
          style={{
            ...styles.title,
          }}
        >
          Full Adress
        </Text>
        <Text style={styles.address}>{props.address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: SIZES.medium,
    marginBottom: 20,
    fontFamily: FONT.Title_Bold,
  },
  address: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
  },
});
