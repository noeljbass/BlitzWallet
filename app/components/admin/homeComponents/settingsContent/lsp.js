import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  useColorScheme,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES} from '../../../../constants';

import * as Clipboard from 'expo-clipboard';
import {useEffect, useRef, useState} from 'react';

import {lspInfo} from '@breeztech/react-native-breez-sdk';
import {useTheme} from '../../../../../context-store/context';

export default function LSPPage(props) {
  const [lsp, setLsp] = useState({});
  const {theme, toggleTheme} = useTheme();

  useEffect(() => {
    getLSPInformation();
  }, []);
  return (
    <View style={styles.globalContainer}>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
          },
        ]}>
        <TouchableOpacity
          onPress={() =>
            props.setDisplayPopup({isDisplayed: true, type: 'LSPInfo'})
          }
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.titleText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            What is an LSP?
          </Text>
          <Image style={{width: 20, height: 20}} source={ICONS.aboutIcon} />
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
          },
        ]}>
        <Text
          style={[
            styles.titleText,
            {
              marginBottom: 5,
              color: theme ? COLORS.darkModeText : COLORS.lightModeText,
            },
          ]}>
          Current LSP
        </Text>
        <TouchableOpacity
          onPress={() => {
            copyToClipboard(lsp.id);
          }}>
          <Text
            style={[
              styles.descriptionText,
              {
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                textAlign: 'center',
              },
            ]}>
            {Object.keys(lsp).length != 0 ? lsp?.name : 'N/A'}
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

  async function getLSPInformation() {
    try {
      const lspInformation = await lspInfo();
      setLsp(lspInformation);
    } catch (err) {
      console.log(err);
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
