import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  useColorScheme,
} from 'react-native';
import {
  BTN,
  CENTER,
  COLORS,
  FONT,
  ICONS,
  SIZES,
  SHADOWS,
} from '../../../constants';
import {useEffect, useRef, useState} from 'react';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';

export function ConnectionToNode(props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [nodeInformation, setNodeInformation] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
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
    if (!props.isDisplayed) {
      fadeIn();
      getNodeData();
    } else fadeOut();
  }, [props.isDisplayed]);

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
  function fadeOut() {
    Animated.timing(fadeAnim, {
      toValue: -1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  return (
    <TouchableWithoutFeedback
      style={styles.globalContainer}
      onPress={() => props.hidePopup(true)}>
      <Animated.View
        style={[
          styles.globalContainer,
          {opacity: fadeAnim},
          {zIndex: !props.isDisplayed ? 1 : -1},
        ]}>
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
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    // backgroundColor: COLORS.gray,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,

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
