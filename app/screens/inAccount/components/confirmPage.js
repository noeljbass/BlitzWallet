import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import {CENTER, COLORS, ICONS, SIZES} from '../../../constants';
import {useEffect, useState} from 'react';

export default function ConfirmPage(props) {
  const [information, setInformation] = useState({});
  console.log('CONFIRM PAYMENT SCREEN', information);
  useEffect(() => {
    if (
      props.information.type != 'invoicePaid' &&
      props.information.type != 'paymentSucceed'
    )
      return;
    setInformation(props.information);
  }, [props.information]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}>
      <View style={styles.popupContainer}>
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              props.setConfirmPage({
                for: '',
                isDisplayed: false,
              });
            }}>
            <Image style={styles.backButton} source={ICONS.xSmallIcon} />
          </TouchableOpacity>
          <View style={styles.innerContainer}>
            <Image style={styles.confirmedIocn} source={ICONS.Checkcircle} />
            <Text style={styles.confirmText}>
              {props.for?.toLowerCase() === 'paymentsucceed'
                ? 'Sent'
                : 'Received'}
            </Text>
            <Text style={styles.dateText}>
              {new Date(
                props.for?.toLowerCase() === 'invoicepaid'
                  ? information.details?.payment?.paymentTime * 1000
                  : information.details?.paymentTime * 1000,
              ).toLocaleString()}
            </Text>
            <Text style={styles.amountText}>
              {props.for?.toLowerCase() === 'invoicepaid'
                ? (information.details?.payment?.amountMsat / 1000)?.toFixed(2)
                : (information.details?.amountMsat / 1000)?.toFixed(2)}
              <Text style={{color: COLORS.primary}}> sat</Text>
            </Text>
            <View style={styles.seperator}></View>

            <Text style={styles.descriptionText}>
              <Text style={styles.descriptor}>Desc</Text>{' '}
              {props.for?.toLowerCase() === 'invoicepaid'
                ? information.details?.payment?.description
                  ? information.details?.payment.description
                  : 'no description'
                : information.details?.description
                ? information.details?.description
                : 'no description'}
            </Text>
            <Text style={styles.feeText}>
              <Text style={styles.descriptor}>Lightning Fees</Text>{' '}
              {props.for?.toLowerCase() === 'invoicepaid'
                ? (information.details?.payment?.feeMsat / 1000).toFixed(2)
                : (information.details?.feeMsat / 1000).toFixed(2)}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  innerContainer: {
    flex: 1,
    alignItems: 'center',
    flex: 1,
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
