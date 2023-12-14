import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CENTER, COLORS, FONT, SHADOWS, SIZES} from '../../../constants';

export function SendRecieveBTNs(props) {
  console.log('SEND RECIVE BUTTONS');
  return (
    <View style={styles.globalContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            props.setSendPayment(true);
          }}
          style={combinedStyles.firstButton}>
          <Text style={styles.text}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.setRecivePayment(true);
          }}
          style={styles.button}>
          <Text style={styles.text}>Receive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // borderTopWidth: 1,
  },

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
