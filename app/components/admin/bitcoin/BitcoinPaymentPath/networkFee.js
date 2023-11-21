import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { CENTER, COLORS, FONT, ICONS, SIZES } from "../../../../constants";
import { useEffect, useState } from "react";
import { NetworkCustomSpeedSelector } from "./networkSpeedAmout";
import { ManualFee } from "./manualFee";
import { InformationPopup } from "./informationPopup";

// const networkSpeedARR = [
//   { time: 30, duration: "m", satVbite: 10.32, fee: 2159 },
//   { time: 16, duration: "h", satVbite: 7.44, fee: 1557 },
//   { time: 20, duration: "h", satVbite: 6.22, fee: 1302 },
// ];

const BLOCKWEIGHT = 150;

export function NetworkFee(props) {
  const [networkSpeeds, setNetworkSpeeds] = useState([]);
  const [selectedNetworkFee, setSelectedNetworkFee] = useState(0);
  const [minfee, setminFee] = useState(0);
  const [activeSpeed, setActiveSpeed] = useState([
    {
      id: 0,
      isSelected: true,
    },
    {
      id: 1,
      isSelected: false,
    },
    {
      id: 2,
      isSelected: false,
    },
    {
      id: 3,
      isSelected: false,
    },
    {
      id: 4,
      amount: 0,
      isSelected: false,
    },
  ]);
  useEffect(() => {
    const URL = "http://192.168.0.102:8000/bitcoin/getEstimatedFee";

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const feeArr = Object.keys(data)
          .map((key) => {
            if (key === "fastestFee") {
              props.setNetworkFee(BLOCKWEIGHT * data[key]);
              return {
                time: 10,
                duration: "M",
                satVbite: data[key],
                fee: BLOCKWEIGHT * data[key],
              };
            } else if (key === "halfHourFee") {
              return {
                time: 30,
                duration: "M",
                satVbite: data[key],
                fee: BLOCKWEIGHT * data[key],
              };
            } else if (key === "hourFee") {
              return {
                time: 1,
                duration: "H",
                satVbite: data[key],
                fee: BLOCKWEIGHT * data[key],
              };
            } else if (key === "economyFee") {
              return {
                time: "1",
                duration: "H",
                satVbite: data[key],
                fee: BLOCKWEIGHT * data[key],
              };
            } else {
              setminFee(data[key]);
              return null;
            }
          })
          .filter((data) => data);

        setNetworkSpeeds(feeArr);
      })
      .catch((err) => console.log(err));
  }, [props.refresh]);

  const [displayManualFee, setDisplayManualFee] = useState(false);
  const [informationPopup, setInformationPopup] = useState(false);

  function activateSelectedNetworkFee() {
    props.setNetworkFee(selectedNetworkFee);
    props.setNetworkFeePopup(false);
  }

  function toggleInformationPopup() {
    setInformationPopup((prev) => !prev);
  }
  const networkSpeedElements = networkSpeeds.map((speed, id) => {
    return (
      <NetworkCustomSpeedSelector
        activeSpeed={activeSpeed}
        setActiveSpeed={setActiveSpeed}
        key={id}
        id={id}
        setNetworkFee={setSelectedNetworkFee}
        {...speed}
      />
    );
  });
  return (
    <View
      style={{
        ...styles.globalContainer,
        top: props.isDisplayed ? 0 : "120%",
      }}
    >
      <View style={{ flex: 1, width: "90%", ...CENTER }}>
        <View
          onTouchEnd={() => {
            props.setNetworkFeePopup(false);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <Image
            source={ICONS.xSmallIcon}
            style={{ width: 30, height: 30, marginRight: "auto" }}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>Edit network fee</Text>
        </View>

        <Text style={styles.selectComfTime}>
          Select a confirmation time.
          <Text
            onPress={toggleInformationPopup}
            style={{
              color: COLORS.primary,
              textDecorationLine: "underline",
            }}
          >
            What's this?
          </Text>
        </Text>

        <View style={{ marginVertical: 30 }}>{networkSpeedElements}</View>
        <TouchableOpacity
          style={{
            backgroundColor: activeSpeed[4].isSelected
              ? COLORS.tertiaryBackground
              : "transparent",
            borderColor: activeSpeed[4].isSelected
              ? COLORS.primary
              : COLORS.gray,

            borderWidth: 1,
            borderRadius: 5,

            flexDirection: "column",

            padding: 10,
          }}
          onPress={() => {
            setDisplayManualFee(true);
          }}
        >
          <Text style={styles.enterFeeTxt}>Enter fee manually</Text>
          {activeSpeed[4].isSelected && (
            <Text
              style={{
                marginTop: 5,
                fontSize: SIZES.medium,
                fontFamily: FONT.Descriptoin_Regular,
              }}
            >
              {activeSpeed[4].amount} SATS
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            activateSelectedNetworkFee();
          }}
          style={{ marginTop: "auto" }}
        >
          <Text
            style={{
              ...styles.button,
              ...styles.confirmFee,
            }}
          >
            Confirm fee
          </Text>
        </TouchableOpacity>
      </View>

      {/* popups */}

      <InformationPopup
        isDisplayed={informationPopup}
        toggleInformationPopup={toggleInformationPopup}
      />

      <ManualFee
        isDisplayed={displayManualFee}
        setDisplayManualFee={setDisplayManualFee}
        setActiveSpeed={setActiveSpeed}
        setNetworkFee={props.setNetworkFee}
        setNetworkFeePopup={props.setNetworkFeePopup}
        minfee={minfee}
        transationWeight={BLOCKWEIGHT}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    position: "absolute",
    left: 0,
    height: "100%",
    width: "100%",
    zIndex: 3,
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: "hidden",
  },
  headerText: {
    marginRight: "auto",
    transform: [{ translateX: -15 }],
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Bold,
  },
  selectComfTime: {
    fontFamily: FONT.Descriptoin_Regular,
  },

  button: {
    width: "100%",
    height: 50,
    lineHeight: 50,
    borderRadius: 5,
    textAlign: "center",
  },

  enterFeeTxt: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
  },

  manualFee: {
    fontSize: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  confirmFee: {
    fontSize: SIZES.medium,
    color: "white",
    textTransform: "uppercase",
    backgroundColor: COLORS.primary,
  },
});
