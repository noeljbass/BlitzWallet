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
  async function getNodeData() {
    const nodeInformatino = await nodeInfo();
    setNodeInformation(nodeInformatino);
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
        <View style={styles.innerContainer}>
          <View style={styles.topContainer}>
            <Image
              style={styles.topContainerImg}
              source={ICONS.connectionIcon}
            />
            <Text style={styles.topContainerText}>Connected</Text>
          </View>
          <Text style={styles.itemText}>
            Block height: {nodeInformation?.blockHeight?.toLocaleString()}
          </Text>
          <Text style={styles.itemText}>
            Max Payable:{' '}
            {(nodeInformation?.maxPayableMsat / 1000).toLocaleString()}
          </Text>
          <Text style={styles.itemText}>
            Max Recivable:{' '}
            {(nodeInformation?.maxReceivableMsat / 1000).toLocaleString()}
          </Text>
          <Text style={styles.itemText}>
            On-chain Balance:{' '}
            {(nodeInformation?.onchainBalanceMsat / 1000).toLocaleString()}
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
  },
  itemText: {
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
});
