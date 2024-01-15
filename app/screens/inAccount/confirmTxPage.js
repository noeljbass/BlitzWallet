import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES} from '../../constants';

import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {setStatusBarStyle} from 'expo-status-bar';
import {useGlobalContextProvider} from '../../../context-store/context';

export default function ConfirmTxPage(props) {
  console.log('CONFIRM PAYMENT SCREEN', information);
  const navigate = useNavigation();
  const [information, setInformation] = useState({});
  const {theme, toggleTheme} = useGlobalContextProvider();
  setStatusBarStyle('light');

  useEffect(() => {
    if (
      props.route.params?.information?.type != 'invoicePaid' &&
      props.route.params?.information?.type != 'paymentSucceed' &&
      props.route.params?.information?.type != 'paymentFailed'
    )
      return;
    setInformation(props.route.params?.information);
  }, []);

  console.log(information);

  return (
    <View
      style={[
        styles.popupContainer,
        {
          backgroundColor: theme
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            setStatusBarStyle(theme ? 'light' : 'dark');
            navigate.goBack();
          }}>
          <Image style={styles.backButton} source={ICONS.xSmallIcon} />
        </TouchableOpacity>
        <View style={styles.innerContainer}>
          <Image style={styles.confirmedIocn} source={ICONS.Checkcircle} />
          <Text
            style={[
              styles.confirmText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {props.route.params?.for?.toLowerCase() === 'paymentfailed'
              ? 'Failed'
              : props.route.params?.for?.toLowerCase() === 'paymentsucceed'
              ? 'Sent'
              : 'Received'}
          </Text>
          <Text
            style={[
              styles.dateText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {props.route.params?.for?.toLowerCase() === 'paymentfailed'
              ? new Date().toLocaleString()
              : new Date(
                  props.route.params?.for?.toLowerCase() === 'invoicepaid'
                    ? information.details?.payment?.paymentTime * 1000
                    : information.details?.paymentTime * 1000,
                ).toLocaleString()}
          </Text>
          {props.route.params?.for?.toLowerCase() != 'paymentfailed' && (
            <Text
              style={[
                styles.amountText,
                {
                  color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                },
              ]}>
              {props.route.params?.for?.toLowerCase() === 'invoicepaid'
                ? (information.details?.payment?.amountMsat / 1000)?.toFixed(2)
                : (information.details?.amountMsat / 1000)?.toFixed(2)}
              <Text
                style={{color: COLORS.primary, fontFamily: FONT.Title_Bold}}>
                {' '}
                sat
              </Text>
            </Text>
          )}
          <View style={styles.seperator}></View>
          {props.route.params?.for?.toLowerCase() === 'paymentfailed' ? (
            <Text>ERROR</Text>
          ) : (
            <>
              <Text
                style={[
                  styles.descriptionText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                <Text style={styles.descriptor}>Desc</Text>{' '}
                {props.route.params?.for?.toLowerCase() === 'invoicepaid'
                  ? information.details?.payment?.description
                    ? information.details?.payment.description
                    : 'no description'
                  : information.details?.description
                  ? information.details?.description
                  : 'no description'}
              </Text>
              <Text
                style={[
                  styles.feeText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                <Text style={styles.descriptor}>Lightning Fees</Text>{' '}
                {props.route.params?.for?.toLowerCase() === 'invoicepaid'
                  ? (information.details?.payment?.feeMsat / 1000).toFixed(2)
                  : (information.details?.feeMsat / 1000).toFixed(2)}
              </Text>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
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
    fontFamily: FONT.Title_Bold,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    fontSize: SIZES.medium,
    marginBottom: 50,
    fontFamily: FONT.Descriptoin_Regular,
  },
  amountText: {
    fontSize: SIZES.large,
    marginBottom: 40,
    fontFamily: FONT.Title_Bold,
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
    fontFamily: FONT.Descriptoin_Regular,
  },
  feeText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
  },
  descriptor: {
    fontWeight: 'bold',
  },
});
