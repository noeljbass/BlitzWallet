import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { CENTER, COLORS, FONT, SIZES } from "../../../../constants";

export function IvalidLightningAddressPopup(props) {
  console.log(props);
  return (
    <View style={{ ...styles.container }}>
      <Text
        style={{
          ...styles.title,
        }}
      >
        Invalid Address
      </Text>
      <Text style={{ ...styles.description }}>
        Please scan/use a Lightning address
      </Text>
      <TouchableOpacity onPress={() => props.setScanned(false)}>
        <Text style={{ ...styles.backBTN }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,

    backgroundColor: "white",

    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: SIZES.huge,
    marginBottom: 5,
    fontFamily: FONT.Title_Bold,
  },
  description: {
    marginBottom: 50,
    fontFamily: FONT.Descriptoin_Regular,
  },

  backBTN: {
    backgroundColor: COLORS.tertiary,
    width: 150,
    textAlign: "center",
    paddingVertical: 10,
    color: COLORS.lightWhite,
    borderRadius: 15,
    overflow: "hidden",
    fontSize: SIZES.large,
    fontFamily: FONT.Other_Regular,
    ...CENTER,
  },
});
