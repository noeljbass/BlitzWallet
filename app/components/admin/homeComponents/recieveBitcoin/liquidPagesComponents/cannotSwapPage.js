import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';
import {COLORS, FONT, SHADOWS, SIZES, CENTER} from '../../../../../constants';

export default function CannotSwapPage(props) {
  return (
    <View
      style={[
        styles.qrcodeContainer,
        {
          marginBottom: 'auto',
          marginVertical: 20,
          justifyContent: 'space-between',
        },
      ]}>
      <ActivityIndicator
        size="large"
        color={props.isDarkMode ? COLORS.darkModeText : COLORS.lightModeText}
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
          transform: [{translateY: 12}],
        }}
      />
      <Text
        style={{
          fontSize: SIZES.large,
          color: COLORS.cancelRed,
        }}>
        {props.swapErrorMessage ? props.swapErrorMessage : ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  qrcodeContainer: {
    width: '90%',
    maxWidth: 250,
    height: 250,
    ...CENTER,

    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
});
