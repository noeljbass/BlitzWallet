import { StyleSheet, View, Text } from "react-native";
import { CENTER, COLORS, FONT, ICONS, SIZES } from "../../../../constants";
import { useState } from "react";

export function NetworkCustomSpeedSelector(props) {
  return (
    <View
      onTouchEnd={() => {
        props.setActiveSpeed((prev) => {
          return prev.map((item) => {
            if (item.id === props.id) {
              return { ...item, isSelected: true };
            } else return { ...item, isSelected: false };
          });
        });

        props.setNetworkFee(props.fee);
      }}
      style={{
        ...styles.networkFeeContainer,
        backgroundColor: props.activeSpeed[props.id].isSelected
          ? COLORS.tertiaryBackground
          : "transparent",
        borderColor: props.activeSpeed[props.id].isSelected
          ? COLORS.primary
          : COLORS.gray,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Text style={styles.text}>
          {typeof props.time === "number" ? "Less than " : "More than "}
          <Text style={{ fontFamily: FONT.Descriptoin_Bold }}>
            {props.time} {props.duration}
          </Text>
        </Text>
        <Text style={styles.text}>{props.fee} SAT</Text>
      </View>
      <Text style={styles.text}>{props.satVbite} sat/vbyte</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  networkFeeContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
  },
});
