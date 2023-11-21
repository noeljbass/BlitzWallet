import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS, FONT, ICONS, SIZES } from "../..//../constants";

export function UserTransaction(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.setExpandtransaction({
          txPos: props.txPos,
          isDisplayed: true,
        });
      }}
    >
      <View style={styles.transactionContainer}>
        {/* {props.completed ? (
        <Image
          source={ICONS.Checkcircle}
          style={styles.icons}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={ICONS.Xcircle}
          style={styles.icons}
          resizeMode="contain"
        />
      )} */}
        <View>
          <Text
            style={{
              ...styles.descriptionText,
            }}
          >
            {props.completed
              ? props.wasSent
                ? "You Sent"
                : "You Recieved"
              : "Pending..."}
          </Text>

          <Text style={styles.dateText}>{props.date}</Text>
        </View>

        <Text
          style={{
            ...styles.amountText,
            color: props.completed
              ? props.wasSent
                ? "red"
                : "green"
              : COLORS.primary,
          }}
        >
          {`${props.wasSent ? "-" : ""}${Number(
            props.amount
          ).toLocaleString()} SAT`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  icons: {
    width: 30,
    height: 30,
    marginRight: 15,
  },

  descriptionText: {
    fontSize: SIZES.large,
    fontWeight: "bold",
    fontFamily: FONT.Descriptoin_Bold,
  },
  dateText: {
    fontFamily: FONT.Descriptoin_Regular,
  },
  amountText: {
    marginLeft: "auto",
    fontFamily: FONT.Other_Regular,
  },
});

const combinedStyles = StyleSheet.create({
  wasSent: {
    ...styles.amountText,
    color: "red",
  },
  wasRecived: {
    ...styles.amountText,
    color: "green",
  },
});
