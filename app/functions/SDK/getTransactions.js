import {listPayments} from '@breeztech/react-native-breez-sdk';

export default async function getTransactions() {
  try {
    const payments = listPayments({});

    return new Promise((resolve, request) => {
      resolve(payments);
    });
  } catch (err) {
    console.log(err);
  }
}
