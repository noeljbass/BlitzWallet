import {StyleSheet, View, TouchableOpacity, Text, Share} from 'react-native';
import {COLORS, CENTER, FONT, SHADOWS, SIZES} from '../../../../constants';
import * as Clipboard from 'expo-clipboard';

export default function ButtonsContainer(props) {
  return (
    <View
      style={[
        styles.buttonsContainer,
        {width: props.selectedRecieveOption != 'bitcoin' ? '90%' : '60%'},
      ]}>
      <TouchableOpacity
        onPress={openShareOptions}
        style={[styles.buttonsOpacity]}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={copyToClipboard}
        style={[styles.buttonsOpacity]}>
        <Text style={styles.buttonText}>Copy</Text>
      </TouchableOpacity>
      {props.selectedRecieveOption != 'bitcoin' && (
        <TouchableOpacity
          onPress={() => props.setEditPaymentPopup(true)}
          style={[styles.buttonsOpacity]}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  async function copyToClipboard() {
    try {
      await Clipboard.setStringAsync(props.generatedAddress);
      window.alert('Text Copied to Clipboard');
    } catch (err) {
      window.alert('ERROR WITH COPYING');
    }
  }

  async function openShareOptions() {
    try {
      await Share.share({
        message: props.generatedAddress,
      });
    } catch {
      window.alert('ERROR with sharing');
    }
  }
}

const styles = StyleSheet.create({
  buttonsContainer: {
    width: '90%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...CENTER,
    marginTop: 'auto',
  },
  buttonsOpacity: {
    height: '100%',
    width: 100,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    // overflow: "hidden",
    ...SHADOWS.medium,
  },
  buttonText: {
    fontFamily: FONT.Other_Regular,
    fontSize: SIZES.medium,
    color: COLORS.background,
  },
});
