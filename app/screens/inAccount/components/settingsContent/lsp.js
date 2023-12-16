import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES} from '../../../../constants';

import * as Clipboard from 'expo-clipboard';
import {useEffect, useRef, useState} from 'react';
import {extractFont} from 'react-native-svg/lib/typescript/lib/extract/extractText';

export default function LSPPage(props) {
  //   const [infoPopup, setInfoPopup] = useState(false);
  return (
    <View style={styles.globalContainer}>
      <View style={[styles.contentContainer]}>
        <TouchableOpacity
          onPress={() =>
            props.setDisplayPopup({isDisplayed: true, type: 'LSPInfo'})
          }
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.titleText}>What is an LSP?</Text>
          <Image style={{width: 20, height: 20}} source={ICONS.aboutIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.titleText, {marginBottom: 5}]}>Current LSP</Text>
        <TouchableOpacity
          onPress={() => {
            copyToClipboard('LSP ID');
          }}>
          <Text style={styles.descriptionText}>
            asdfasdfasfasdfasdfasdfasdfafadsfasdfasdfasdfasdfs
          </Text>
        </TouchableOpacity>
      </View>
      {/* <InfoPopup isDisplayed={infoPopup} /> */}
    </View>
  );

  async function copyToClipboard(content) {
    try {
      await Clipboard.setStringAsync(content);
      window.alert('LSP Id copied successfully');
    } catch (err) {
      window.alert('Error copying LSP Id');
    }
  }
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    backgroundColor: COLORS.offsetBackground,
    padding: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  titleText: {
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
  },
  descriptionText: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
  },
});
