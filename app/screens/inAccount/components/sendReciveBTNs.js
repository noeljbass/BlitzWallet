import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CENTER, COLORS, FONT, SIZES} from '../../../constants';

export function SendRecieveBTNs(props) {
  console.log(props.for);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.setIsCameraActive(true);
          props.setScreenType(props.for);
        }}
        style={combinedStyles.firstButton}>
        <Text style={styles.text}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.setRecivePayment(true);
          props.setNeedToRefresh(prev => (prev += 1));
        }}
        style={styles.button}>
        <Text style={styles.text}>Receive</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 50,
    flexDirection: 'row',

    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    backgroundColor: COLORS.gray2,
    overflow: 'hidden',
    ...CENTER,
  },
  button: {
    height: '100%',
    width: '50%',

    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Other_Regular,
  },
});

const combinedStyles = StyleSheet.create({
  firstButton: {
    ...styles.button,
    borderRightWidth: 1,
  },
});
