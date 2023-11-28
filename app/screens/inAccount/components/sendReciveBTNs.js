import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CENTER, COLORS, FONT, SHADOWS, SIZES} from '../../../constants';

export function SendRecieveBTNs(props) {
  console.log('SEND RECIVE BUTTONS');
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          props.setSendPayment(true);
          // props.setScreenType(props.for);
        }}
        style={combinedStyles.firstButton}>
        <Text style={styles.text}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.setRecivePayment(true);
          // props.setNeedToRefresh(prev => (prev += 1));
        }}
        style={styles.button}>
        <Text style={styles.text}>Receive</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',

    ...CENTER,
  },
  button: {
    height: '100%',
    width: 130,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    // overflow: "hidden",
    ...SHADOWS.medium,
  },
  text: {
    fontFamily: FONT.Other_Regular,
    fontSize: SIZES.medium,
    color: COLORS.background,
  },
});

const combinedStyles = StyleSheet.create({
  firstButton: {
    ...styles.button,
  },
});
