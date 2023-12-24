import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import {CENTER, COLORS, FONT, ICONS, SIZES} from '../../../constants';

export default function TransactionDetials(props) {
  console.log('Transaction Detials Page');

  return (
    <Modal
      animationType="slide"
      transparent={false}
      statusBarTranslucent={false}
      visible={props.isDisplayed}>
      <View
        style={[
          styles.popupContainer,
          {
            backgroundColor: props.isDarkMode
              ? COLORS.darkModeBackground
              : COLORS.lightModeBackground,
          },
        ]}>
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => {
              props.setExpandedTransactoin({
                isDisplayed: false,
                txId: null,
              });
            }}>
            <Image style={styles.backButton} source={ICONS.xSmallIcon} />
          </TouchableOpacity>
          <Text style={{color: 'black'}}>{props.txId}</Text>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
  },
});
