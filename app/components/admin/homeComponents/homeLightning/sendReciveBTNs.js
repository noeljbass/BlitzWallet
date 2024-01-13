import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CENTER, COLORS, FONT, SHADOWS, SIZES} from '../../../../constants';
import {useNavigation} from '@react-navigation/native';
import * as Device from 'expo-device';
import {getLocalStorageItem, setLocalStorageItem} from '../../../../functions';
import {removeLocalStorageItem} from '../../../../functions/localStorage';

export function SendRecieveBTNs(props) {
  const navigate = useNavigation();

  return (
    <View
      style={[
        styles.globalContainer,
        {paddingBottom: Device.osName === 'IOS' ? 0 : 10},
      ]}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            (async () => {
              const areSettingsSet = await handleSettingsCheck();
              if (!areSettingsSet) return;
              navigate.navigate('SendBTC', {isDarkMode: props.theme});
            })();
          }}
          style={combinedStyles.firstButton}>
          <Text style={styles.text}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            (async () => {
              const areSettingsSet = await handleSettingsCheck();
              if (!areSettingsSet) return;
              navigate.navigate('ReceiveBTC', {isDarkMode: props.theme});
            })();
          }}
          style={styles.button}>
          <Text style={styles.text}>Receive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

async function handleSettingsCheck() {
  const currency = await getLocalStorageItem('currency');
  if (!currency) setLocalStorageItem('currency', 'USD');
  return new Promise(resolve => {
    resolve(true);
  });
}

const styles = StyleSheet.create({
  globalContainer: {
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
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
