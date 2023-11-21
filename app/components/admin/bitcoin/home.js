import { StyleSheet, Text, View, ScrollView } from "react-native";
import { ExpandedTransaction, SendRecieveBTNs, UserSatAmount } from "../index";
import { useEffect, useState } from "react";
import { retrieveData, storeData } from "../../global/dataStorage";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../global/localStorage";
import { UserTransaction } from "./transactions";
import { CENTER } from "../../../constants";

// {
//   completed: true,
//   description: "testingtestingtestingtestingtestingtesting",
//   date: "this is a date",
//   amount: "1000",
//   wasSent: false,
// },
const TXS = [
  {
    txPos: 0,
    completed: true,
    wasSent: 1 > 0 ? false : true,
    amount: 10000,
    date: "this is a date",
    description: "",
    txid: "asdfasfjaslkdfjasodjasdlkjsalkfjasdlfkjasldf",
    address: "alsdjfalskdfjasldjfaslkdfjaslkdf",
    fee: 150,
  },
];

export default function HomeBitcoin(props) {
  const [refreshpayment, setRefreshTransactions] = useState(0);

  const [transactions, setTransactions] = useState([]);

  const [expandTransaction, setExpandtransaction] = useState({
    txPos: 0,
    isDisplayed: false,
  });
  const transactionElement = transactions.map((transaction, id) => {
    return (
      <UserTransaction
        setExpandtransaction={setExpandtransaction}
        key={id}
        {...transaction}
      />
    );
  });

  // user balance
  useEffect(() => {
    console.log("Test");
    const init = async () => {
      const mneomic = await retrieveData("key");
      const numAddresses = await getLocalStorageItem("numAddresses");
      if (numAddresses) {
        const URL = "http://192.168.0.102:8000/bitcoin/getUserBalance";
        const requestData = {
          mnemonic: mneomic,
          numAddresses: numAddresses,
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
            console.log(data, "TTT");

            if (data === "ERROR") return;

            const balance = data
              .map((address) => {
                return (
                  Number(address["chain_stats"]["funded_txo_sum"]) -
                  Number(address["chain_stats"]["spent_txo_sum"])
                );
              })
              .reduce((a, b) => {
                return a + b;
              }, 0);
            props.setBitcoinAmount(`${balance}`);
          });
      } else {
        props.setBitcoinAmount("0");
      }
    };

    init();
  }, [props.manualRefresh]);

  useEffect(() => {
    async function init() {
      // checking for already loaded payments

      const alreadyLoadedPayments = await getLocalStorageItem(
        "btcTransactions"
      );
      if (alreadyLoadedPayments) {
        setTransactions(JSON.parse(alreadyLoadedPayments));
      }

      const mneomic = await retrieveData("key");
      const numAddresses = await getLocalStorageItem("numAddresses");

      if (!numAddresses) return;
      const URL = "http://192.168.0.102:8000/bitcoin/getUserTransactions";
      const requestData = {
        mnemonic: mneomic,
        numAddresses: numAddresses,
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
          if (!data) return;
          const apiTranasactoins = data.filter((tx) => tx[0].length != 0);

          if (apiTranasactoins.length === 0) {
            setTransactions([]);
            return;
          } else {
            let formatedTransactions = [];
            const localStringFormmating = {
              year: "numeric",
              month: "short", // Short month name (e.g., Sep)
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true, // Use 12-hour clock (AM/PM)
            };
            apiTranasactoins.forEach((transaction) => {
              const address = transaction[1];
              let transactionCounter = 0;

              while (true) {
                const innerTransaction = transaction[0][transactionCounter];
                if (!innerTransaction) {
                  break;
                }
                const { txid, status, fee, vout, vin } = innerTransaction;
                // Check if any input addresses match your addresses (sent transaction)
                const isSentTransaction = vin.some((input) => {
                  const inputAddress = input.prevout.scriptpubkey_address;
                  return address.includes(inputAddress);
                });

                // Check if any output addresses match your addresses (received transaction)
                const isReceivedTransaction = vout.some((output) => {
                  const outputAddress = output.scriptpubkey_address;
                  return address.includes(outputAddress);
                });
                let transactionAmount;
                let wasSent;

                if (isReceivedTransaction && isSentTransaction) {
                  transactionAmount = vout[0].value;
                  wasSent = true;
                } else if (isReceivedTransaction) {
                  transactionAmount = vout.reduce((total, output) => {
                    if (output.scriptpubkey_address != address)
                      return (total += 0);

                    return total + output.value;
                  }, 0);
                  wasSent = false;
                } else if (isSentTransaction) {
                  transactionAmount = vin.reduce((total, output) => {
                    if (output.scriptpubkey_address === address)
                      return (total += 0);

                    return total + output.prevout.value;
                  }, 0);
                  wasSent = true;
                }

                const txObject = {
                  txPos: transactionCounter,
                  completed: status.confirmed,
                  wasSent: wasSent,
                  amount: transactionAmount,
                  date: status.confirmed
                    ? new Date(Number(status.block_time) * 1000).toLocaleString(
                        "en-US",
                        localStringFormmating
                      )
                    : null,
                  description: "",
                  txid: txid,
                  address: address,
                  fee: fee,
                  blockHeight: Number(status.block_height),
                };
                formatedTransactions.push(txObject);

                if (
                  isReceivedTransaction &&
                  isSentTransaction &&
                  vout[0].scriptpubkey_address === address
                ) {
                  transactionCounter += 1;
                  formatedTransactions.push({
                    ...txObject,
                    wasSent: !txObject.wasSent,
                    txPos: transactionCounter,
                  });
                }

                transactionCounter += 1;
              }
            });

            setTransactions(formatedTransactions);
            setLocalStorageItem(
              "btcTransactions",
              JSON.stringify(formatedTransactions)
            );
          }
        });
    }

    init();
  }, [refreshpayment, props.manualRefresh]);

  return (
    <>
      <UserSatAmount bitcoinAmt={props.bitcoinAmount} />
      <ScrollView style={style.scrollContainer}>
        {transactionElement}
      </ScrollView>
      <SendRecieveBTNs
        setScreenType={props.setScreenType}
        for="bitcoin"
        setIsCameraActive={props.setIsCameraActive}
        setNeedToRefresh={props.setNeedToRefresh}
        setRecivePayment={props.setRecivePayment}
      />
      <ExpandedTransaction
        transactions={transactions}
        expandTransaction={expandTransaction}
        setExpandtransaction={setExpandtransaction}
      />
    </>
  );
}

const style = StyleSheet.create({
  scrollContainer: {
    width: "90%",

    marginVertical: 20,
    ...CENTER,
  },
});
