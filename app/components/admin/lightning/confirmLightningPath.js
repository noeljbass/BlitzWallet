import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CENTER, COLORS, SIZES } from "../../../constants";
import { LightningPaymentPage } from "./lightningPaymentPath/paymentPage";
import { useEffect, useState } from "react";
import { IvalidLightningAddressPopup } from "./lightningPaymentPath/invlidAddressPopup";

export function ConfirmLightningPath(props) {
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [lnInformation, setLnInformation] = useState({});

  useEffect(() => {
    const address = props.BTCadress;

    const URL = "http://192.168.0.102:8000/lightning/decodeLNURL";

    const requestData = {
      LNURL: address,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-type": "application/json",
      },
    };
    fetch(URL, options)
      .then((response) => response.json())
      .then((data) => {
        if (data === "ERROR") {
          setIsValidAddress(false);
        } else {
          setLnInformation(data);
        }
      });
  }, [props.BTCadress]);

  return (
    <>
      {isValidAddress && (
        <LightningPaymentPage {...props} lnInformation={lnInformation} />
      )}
      {!isValidAddress && <IvalidLightningAddressPopup {...props} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,

    backgroundColor: "white",
  },
});
