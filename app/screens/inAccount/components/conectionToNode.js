import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  TouchableWithoutFeedback,
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

export function ConnectionToNode(props) {
  return (
    <Modal
      animationType="fade"
      transparent={false}
      statusBarTranslucent={false}
      visible={!props.isDisplayed}
      style={{opacity: 0.5}}>
      <View
        onPress={() => props.hidePopup(ture)}
        style={[
          {paddingTop: 'deviceType' === 'deviceType' ? 55 : 0},
          styles.globalContainer,
        ]}>
        <TouchableOpacity onPress={() => props.hidePopup(true)}>
          <Image
            source={ICONS.leftCheveronIcon}
            style={{width: 30, height: 30, marginRight: 4}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.innerContainer}>
          <View style={styles.topContainer}>
            <Image
              style={styles.topContainerImg}
              source={ICONS.connectionIcon}
            />
            <Text style={styles.topContainerText}>Connected</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    // backgroundColor: COLORS.gray,
    flex: 1,
  },
  innerContainer: {
    width: '90%',
    height: 300,
    marginTop: 'auto',
    marginBottom: 'auto',
    ...CENTER,

    backgroundColor: COLORS.tertiaryBackground,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
