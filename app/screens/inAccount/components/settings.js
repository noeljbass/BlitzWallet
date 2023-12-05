import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES} from '../../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import SettingsContent from './settingsContent/home';

const GENERALOPTIONS = [
  {
    for: 'general',
    name: 'About',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
  {
    for: 'general',
    name: 'Display',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
  {
    for: 'general',
    name: 'Node Info',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
  {
    for: 'general',
    name: 'Channels',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
  {
    for: 'general',
    name: 'Notifications',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
];
const SECURITYOPTIONS = [
  {
    for: 'Security & Customization',
    name: 'Face ID',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
  {
    for: 'Security & Customization',
    name: 'Recovery phrase',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
  {
    for: 'Security & Customization',
    name: 'LSP',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
];
const ADVANCEDOPTIONS = [
  {
    for: 'Closeing Accont',
    name: 'Drain Wallet',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
  {
    for: 'Closeing Accont',
    name: 'Reset Wallet',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
  {
    for: 'Closeing Accont',
    name: 'Force-close channels',
    icon: ICONS.Checkcircle,
    arrowIcon: ICONS.leftCheveronIcon,
  },
];
const SETTINGSOPTIONS = [
  [...GENERALOPTIONS],
  [...SECURITYOPTIONS],
  [...ADVANCEDOPTIONS],
];

export default function SystemSettings(props) {
  const [settingsContent, setSettingsContent] = useState({
    isDisplayed: false,
    for: 'About',
  });
  const fadeAnim = useRef(new Animated.Value(600)).current;

  const settingsElements = SETTINGSOPTIONS.map((element, id) => {
    const internalElements = element.map((element, id) => {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.listContainer}
          key={id}
          onPress={() => {
            setSettingsContent({isDisplayed: true, for: element.name});
          }}>
          <Image style={styles.listIcon} source={element.icon} />
          <Text style={styles.listText}>{element.name}</Text>
          <Image
            style={[styles.listIcon, {transform: [{rotate: '180deg'}]}]}
            source={element.arrowIcon}
          />
        </TouchableOpacity>
      );
    });
    return (
      <View key={id} style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>
          {id === 0
            ? 'general'
            : id === 1
            ? 'Security & Customization'
            : 'Closeing Accont'}
        </Text>
        <View style={styles.optionsListContainer}>{internalElements}</View>
      </View>
    );
  });

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
  function fadeOut() {
    Animated.timing(fadeAnim, {
      toValue: 600,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (props.isDisplayed) fadeIn();
    else fadeOut();
  }, [props.isDisplayed]);

  return (
    <Animated.View
      style={[styles.globalContainer, {transform: [{translateX: fadeAnim}]}]}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => props.setSystemSettingsPopup(false)}>
            <Image style={styles.topBarIcon} source={ICONS.leftCheveronIcon} />
          </TouchableOpacity>
          <Text style={styles.topBarText}>Settings</Text>
        </View>
        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.settingsContainer}>
          {settingsElements}
        </ScrollView>
      </SafeAreaView>

      {/* popups */}
      <SettingsContent
        {...settingsContent}
        setSettingsContent={setSettingsContent}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    height: '100%',
    width: '100%',

    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarIcon: {
    width: 25,
    height: 25,
  },
  topBarText: {
    fontSize: SIZES.large,
    marginRight: 'auto',
    marginLeft: 'auto',
    transform: [{translateX: -12.5}],
    fontFamily: FONT.Title_Bold,
  },

  //
  settingsContainer: {
    width: '100%',
    height: '100%',
  },

  optionsContainer: {
    width: '90%',
    marginTop: 20,
  },
  optionsTitle: {
    fontSize: SIZES.medium,
    textTransform: 'uppercase',
    marginBottom: 5,
    fontFamily: FONT.Title_Regular,
  },
  optionsListContainer: {
    backgroundColor: COLORS.offsetBackground,
    padding: 5,
    borderRadius: 8,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  listText: {
    fontSize: SIZES.medium,
    marginRight: 'auto',
    marginLeft: 10,
    fontFamily: FONT.Descriptoin_Regular,
  },
  listIcon: {
    width: 20,
    height: 20,
  },
});
