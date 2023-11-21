import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT, SIZES } from "../../../../constants";

export function InformationPopup(props) {
  return (
    <View
      onTouchEnd={props.toggleInformationPopup}
      style={{
        ...styles.container,
        top: props.isDisplayed ? 0 : "120%",
      }}
    >
      <View style={{ ...styles.content, backgroundColor: "white" }}>
        <Text style={styles.title}>Network fee and confirmation times</Text>
        <Text
          style={{
            ...styles.description,
            marginBottom: 30,
          }}
        >
          [walletname] takes an average of the last 5 blocks fee and suggests
          the optimal fee needed to confirm your transaction in the next 3
          blocks.
        </Text>
        <Text
          style={{
            ...styles.description,
            marginBottom: 30,
          }}
        >
          A higher fee will give you more priority, meaning your transaction
          will confirm faster. While a lower fee will give you less priority and
          therfore slower confirmation speed.
        </Text>
        <Text
          style={{
            ...styles.description,
          }}
        >
          When there is more activity on the network, fees will rise as there is
          more competition for blockspace. If fees increse while your
          transaction is confirming it may take longer than expected.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.opaicityGray,
    position: "absolute",
    left: 0,
    zIndex: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: SIZES.medium,
    marginBottom: 20,
    fontFamily: FONT.Title_Bold,
  },
  description: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
    lineHeight: 25,
  },
  content: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,

    padding: 20,
  },
});
