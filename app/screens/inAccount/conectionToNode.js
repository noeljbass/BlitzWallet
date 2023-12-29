import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES, SHADOWS} from '../../constants';
import {useEffect, useState} from 'react';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';
import {useNavigation} from '@react-navigation/native';

export function ConnectionToNode(props) {
  const [nodeInformation, setNodeInformation] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigation();
  const isDarkMode = props.route.params?.isDarkMode;

  async function getNodeData() {
    try {
      const nodeInformatino = await nodeInfo();
      setNodeInformation(nodeInformatino);
      setIsConnected(true);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getNodeData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => navigate.goBack()}>
      <View style={styles.globalContainer}>
        <View
          style={[
            styles.innerContainer,
            {
              backgroundColor: isDarkMode
                ? COLORS.darkModeBackground
                : COLORS.lightModeBackground,
            },
          ]}>
          <View style={styles.topContainer}>
            <Image
              style={styles.topContainerImg}
              source={ICONS.connectionIcon}
            />
            <Text
              style={[
                styles.topContainerText,
                {
                  color: isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Text>
          </View>
          <Text
            style={[
              styles.itemText,
              {
                color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Block height:{' '}
            {isConnected
              ? nodeInformation?.blockHeight?.toLocaleString()
              : 'N/A'}
          </Text>
          <Text
            style={[
              styles.itemText,
              {
                color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Max Payable:{' '}
            {isConnected
              ? (nodeInformation?.maxPayableMsat / 1000).toLocaleString()
              : 'N/A'}
          </Text>
          <Text
            style={[
              styles.itemText,
              {
                color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            Max Recivable:{' '}
            {isConnected
              ? (nodeInformation?.inboundLiquidityMsats / 1000).toLocaleString()
              : 'N/A'}
          </Text>
          <Text
            style={[
              styles.itemText,
              {
                color: isDarkMode ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            On-chain Balance:{' '}
            {isConnected
              ? (nodeInformation?.onchainBalanceMsat / 1000).toLocaleString()
              : 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: COLORS.opaicityGray,
  },
  innerContainer: {
    width: '90%',
    height: 300,

    padding: 20,
    borderRadius: 8,
    ...SHADOWS.medium,

    backgroundColor: COLORS.background,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  topContainerImg: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  topContainerText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    fontFamily: FONT.Title_Bold,
  },
  itemText: {
    fontSize: SIZES.medium,
    marginBottom: 10,
    fontFamily: FONT.Descriptoin_Regular,
  },
});
