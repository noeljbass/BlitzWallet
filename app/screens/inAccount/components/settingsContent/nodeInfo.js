import {nodeInfo} from '@breeztech/react-native-breez-sdk';
import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONT, SIZES, SHADOWS} from '../../../../constants';
import * as Clipboard from 'expo-clipboard';

export default function NodeInfo() {
  const [lnNodeInfo, setLNNodeInfo] = useState({});
  const [isInfoSet, stIsInfoSet] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const lightningNode = await nodeInfo();
        setLNNodeInfo(lightningNode);
        stIsInfoSet(true);
      } catch (err) {}
    })();
  }, []);

  async function copyToClipboard(data) {
    try {
      await Clipboard.setStringAsync(data);
      window.alert('Text Copied to Clipboard');
    } catch (err) {
      window.alert('Error with copy');
      console.log(err);
    }
  }

  console.log(lnNodeInfo);

  const connectedPeersElements = lnNodeInfo?.connectedPeers?.map((peer, id) => {
    return (
      <View
        key={id}
        style={{
          borderBottomWidth: lnNodeInfo?.connectedPeers.length === 1 ? 0 : 2,
        }}>
        <Text style={styles.peerTitle}>Peer ID</Text>
        <TouchableOpacity
          onPress={() => {
            copyToClipboard(peer);
          }}>
          <Text style={styles.descriptionContent}>{peer}</Text>
        </TouchableOpacity>
      </View>
    );
  });
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.sectionTitle}>Lightning</Text>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Node ID</Text>
            {isInfoSet && (
              <TouchableOpacity
                onPress={() => {
                  copyToClipboard(lnNodeInfo?.id);
                }}>
                <Text style={styles.descriptionContent}>{lnNodeInfo?.id}</Text>
              </TouchableOpacity>
            )}
            {!isInfoSet && <Text style={styles.descriptionContent}>N/A</Text>}
          </View>
          <View style={[styles.itemContainer, styles.horizontalContainer]}>
            <View style={styles.innerHorizontalContainer}>
              <Text style={styles.itemTitle}>Max Payable</Text>
              <Text style={styles.descriptionContent}>
                {isInfoSet
                  ? (lnNodeInfo?.maxPayableMsat / 1000).toLocaleString()
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.innerHorizontalContainer}>
              <Text style={styles.itemTitle}>Max Receivable</Text>
              <Text style={styles.descriptionContent}>
                {isInfoSet
                  ? (lnNodeInfo?.inboundLiquidityMsats / 1000).toLocaleString()
                  : 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Connected Peers</Text>
            {isInfoSet && (
              <ScrollView style={{height: 120}}>
                {connectedPeersElements}
              </ScrollView>
            )}
            {!isInfoSet && <Text style={styles.descriptionContent}>N/A</Text>}
          </View>
        </View>
        {/* Bitcoin */}
        <View>
          <Text style={styles.sectionTitle}>Bitcoin</Text>
          <View
            style={[
              styles.itemContainer,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            <Text style={[styles.itemTitle, {width: 'auto', marginBottom: 0}]}>
              Onchain Balance
            </Text>
            <Text style={styles.descriptionContent}>
              {isInfoSet
                ? (lnNodeInfo?.onchainBalanceMsat / 1000).toLocaleString()
                : 'N/A'}
            </Text>
          </View>
          <View
            style={[
              styles.itemContainer,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            <Text style={[styles.itemTitle, {width: 'auto', marginBottom: 0}]}>
              Block Height
            </Text>
            <Text style={styles.descriptionContent}>
              {isInfoSet ? lnNodeInfo?.blockHeight?.toLocaleString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    flex: 1,
    paddingTop: 10,
  },

  sectionTitle: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.large,
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: COLORS.offsetBackground,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    // ...SHADOWS.small,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  innerHorizontalContainer: {
    alignItems: 'center',
  },
  itemTitle: {
    width: '100%',
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
  descriptionContent: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
  },

  peerTitle: {
    fontFamily: FONT.Other_Bold,
    fontSize: SIZES.medium,
    marginBottom: 5,
  },
});
