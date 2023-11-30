import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
} from 'react-native';
import {CENTER, COLORS, ICONS, SIZES} from '../../../../constants';

import {useEffect, useRef, useState} from 'react';

export default function ConfirmPaymentScreen(props) {
  const [confirmedTransaction, setConfirmedTransation] = useState({});
  const fadeAnim = useRef(new Animated.Value(900)).current;

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
  function fadeOut() {
    Animated.timing(fadeAnim, {
      toValue: 900,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (props.isDisplayed) {
      setConfirmedTransation(props.breezInformation?.transactions[0]);
      fadeIn();
    } else fadeOut();
  }, [props.isDisplayed]);

  return (
    <Animated.View
      style={[styles.popupContainer, {transform: [{translateY: fadeAnim}]}]}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity onPress={props.clear}>
          <Image style={styles.backButton} source={ICONS.xSmallIcon} />
        </TouchableOpacity>
        <View style={styles.innerContainer}>
          <Image style={styles.confirmedIocn} source={ICONS.Checkcircle} />
          <Text style={styles.confirmText}>Confirmed</Text>
          <Text style={styles.dateText}>
            {new Date(
              confirmedTransaction?.paymentTime * 1000,
            ).toLocaleString()}
          </Text>
          <Text style={styles.amountText}>
            {(confirmedTransaction?.amountMsat / 1000)?.toFixed(2)}{' '}
            <Text style={{color: COLORS.primary}}>sat</Text>
          </Text>
          <View style={styles.seperator}></View>

          <Text style={styles.descriptionText}>
            <Text style={styles.descriptor}>Desc</Text>{' '}
            {confirmedTransaction?.description
              ? confirmedTransaction.description
              : 'no description'}
          </Text>
          <Text style={styles.feeText}>
            <Text style={styles.descriptor}>Lightning Fees</Text>{' '}
            {confirmedTransaction?.feeMsat}
          </Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    width: '100%',
    height: '100%',

    position: 'absolute',

    left: 0,
    zIndex: 2,

    backgroundColor: COLORS.background,
  },

  innerContainer: {
    width: '100%',

    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',

    padding: 20,
  },

  backButton: {
    width: 40,
    height: 40,
  },
  confirmedIocn: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
  confirmText: {
    fontSize: SIZES.huge,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    fontSize: SIZES.medium,
    marginBottom: 50,
  },
  amountText: {
    fontSize: SIZES.large,
    marginBottom: 40,
  },
  seperator: {
    backgroundColor: COLORS.primary,
    width: 100,
    height: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
  feeText: {
    fontSize: SIZES.medium,
  },
  descriptor: {
    fontWeight: 'bold',
  },
});
