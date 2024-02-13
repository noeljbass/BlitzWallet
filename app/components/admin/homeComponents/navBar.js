import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {CENTER, COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../constants';

import {useNavigation} from '@react-navigation/native';
import {useGlobalContextProvider} from '../../../../context-store/context';

export default function NavBar(props) {
  console.log('NAV BAR PAGE');

  const navigate = useNavigation();
  const {nodeInformation, theme} = useGlobalContextProvider();

  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        onPress={() => navigate.navigate('ConnectionToNode')}
        style={{
          ...styles.icons,
          backgroundColor: nodeInformation.didConnectToNode
            ? COLORS.connectedNodeColor
            : COLORS.notConnectedNodeColor,
          marginRight: 10,
        }}>
        <Image style={styles.imgIcon} source={ICONS.connectionIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigate.navigate('ViewAllTxPage');
        }}
        activeOpacity={0.5}
        style={[
          styles.icons,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
            marginRight: 'auto',
          },
        ]}>
        <Image style={styles.imgIcon} source={ICONS.receiptIcon} />
      </TouchableOpacity>
      {/* <TouchableOpacity
          onPress={() => {
            navigate.navigate('ContactsPage', {
              isDarkMode: theme,
            });
          }}
          activeOpacity={0.5}
          style={[
            styles.icons,
            {
              backgroundColor: theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset,
            },
          ]}>
          <Image style={styles.imgIcon} source={ICONS.contactsIcon} />
        </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => {
          navigate.navigate('SettingsHome');
        }}
        activeOpacity={0.5}
        style={[
          styles.icons,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
            marginRight: 10,
          },
        ]}>
        <Image style={styles.imgIcon} source={ICONS.settingsIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.icons,
          {
            backgroundColor: theme
              ? COLORS.darkModeBackgroundOffset
              : COLORS.lightModeBackgroundOffset,
          },
        ]}
        activeOpacity={0.5}
        onPress={() => {
          navigate.navigate('FaucetHome');
        }}>
        <Image style={styles.imgIcon} source={ICONS.faucetIcon} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  //   topBar
  topBar: {
    width: '90%',
    height: 35,
    display: 'flex',
    marginTop: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...CENTER,
    zIndex: 1,
  },
  topBarName: {
    fontSize: SIZES.large,
    fontFamily: FONT.Title_Bold,
  },

  icons: {
    width: 35,
    height: '100%',
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  imgIcon: {
    width: 15,
    height: 15,
  },
});
