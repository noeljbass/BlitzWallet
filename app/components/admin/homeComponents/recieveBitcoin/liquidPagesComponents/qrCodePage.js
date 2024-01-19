import axios from 'axios';
import {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';
import {COLORS, FONT, SHADOWS, SIZES, CENTER} from '../../../../../constants';

import {generateSecureRandom} from 'react-native-securerandom';
import ecc from '@bitcoinerlab/secp256k1';
import {ECPairFactory} from 'ecpair';
import QRCode from 'react-native-qrcode-svg';
import {receivePayment} from '@breeztech/react-native-breez-sdk';

import RNEventSource from 'react-native-event-source';
const ECPair = ECPairFactory(ecc);

export default function QrCodePage(props) {
  const [generatingQrCode, setGeneratingQrCode] = useState(true);

  const [evenSource, setEventSource] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const satAmount =
          props.liquidAmount -
          props.feeInfo.liquidFee -
          props.liquidAmount * props.feeInfo.boltzFeePercent;

        const invoice = await receivePayment({
          amountMsat: satAmount * 1000,
          description: 'Liquid Swap',
        });

        if (invoice) {
          const swapInfo = await createLiquidSwap(
            invoice.lnInvoice.bolt11,
            props.feeInfo.hash,
          );

          props.setGeneratedAddress(swapInfo.bip21);
          setGeneratingQrCode(false);

          const eventSource = new RNEventSource(
            'https://api.boltz.exchange/streamswapstatus?id=' + swapInfo.id,
          );
          eventSource.addEventListener('message', event => {
            setEventSource(event.data);
          });
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <>
      <View style={[styles.qrcodeContainer]}>
        {generatingQrCode && (
          <ActivityIndicator
            size="large"
            color={
              props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText
            }
          />
        )}
        {!generatingQrCode && (
          <QRCode
            size={250}
            value={
              props.generatedAddress ? props.generatedAddress : 'lets swap'
            }
            color={
              props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText
            }
            backgroundColor={
              props.isDarkMode
                ? COLORS.darkModeBackground
                : COLORS.lightModeBackground
            }
          />
        )}
      </View>
      <View style={styles.transactionStatusContainer}>
        <Text
          style={[
            styles.statusTitle,
            {
              color: props.isDarkMode
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          Status:
        </Text>
        <View style={{height: 80, justifyContent: 'space-between'}}>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  evenSource === '{"status":"invoice.set"}' ||
                  evenSource === '{"status":"transaction.mempool"}' ||
                  evenSource === '{"status":"invoice.pending"}'
                    ? 'green'
                    : props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
              },
            ]}>
            Invoice Set
          </Text>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  evenSource === '{"status":"transaction.mempool"}' ||
                  evenSource === '{"status":"invoice.pending"}'
                    ? 'green'
                    : props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
              },
            ]}>
            In mempool
          </Text>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  evenSource === '{"status":"invoice.pending"}'
                    ? 'green'
                    : props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
              },
            ]}>
            Payment Pending
          </Text>
        </View>
      </View>
    </>
  );
}

async function createLiquidSwap(invoice, hash) {
  try {
    const randomBytesArray = await generateSecureRandom(32);
    const privateKey = Buffer.from(randomBytesArray);
    // Create a public key from the private key
    const publicKey =
      ECPair.fromPrivateKey(privateKey).publicKey.toString('hex');

    const url = 'https://api.boltz.exchange/createswap';
    // Set the Content-Type header to application/json
    const headers = {
      'Content-Type': 'application/json',
    };
    const postData = {
      type: 'submarine',
      pairId: 'L-BTC/BTC',
      orderSide: 'sell',
      invoice: invoice,
      //   pairHash: hash,
      refundPublicKey: publicKey,
    };

    const request = await axios.post(url, postData);

    return new Promise(resolve => {
      resolve(request.data);
    });

    // console.log(request.data);
  } catch (err) {
    console.log(err);
    return new Promise(resolve => {
      resolve(false);
    });
  }
}
const styles = StyleSheet.create({
  qrcodeContainer: {
    width: '90%',
    maxWidth: 250,
    height: 250,
    ...CENTER,

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },

  transactionStatusContainer: {
    width: 220,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CENTER,
  },
  statusTitle: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Bold,
  },
  statusText: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
  },
});
