import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {getLocalStorageItem, setLocalStorageItem} from '../../../../functions';
import {CENTER, COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import {useContext, useEffect, useRef, useState} from 'react';
import {useTheme} from '../../../../../context-store/context';

export default function DisplayOptions() {
  // const sytemColorScheme = useColorScheme();
  const sliderAnim = useRef(new Animated.Value(3)).current;
  const {theme, toggleTheme, userTxPreferance, toggleUserTxPreferance} =
    useTheme();
  const systemTheme = useColorScheme() === 'dark';

  useEffect(() => {
    (async () => {
      const activeColorScheme = await getLocalStorageItem('colorScheme');

      handleSlide(
        JSON.parse(activeColorScheme) === 'dark'
          ? 'dark'
          : JSON.parse(activeColorScheme) === 'system'
          ? 'system'
          : 'light',
      );
    })();
  }, []);

  const homeScreenTxElements = createHomepageTxOptions(
    userTxPreferance,
    toggleUserTxPreferance,
    theme,
  );

  return (
    <View style={{flex: 1}}>
      <View style={{paddingTop: 25, alignItems: 'center'}}>
        <Text
          style={[
            styles.infoHeaders,
            {
              color: theme ? COLORS.darkModeText : COLORS.lightModeText,
            },
          ]}>
          Color Scheme
        </Text>
        <View
          style={[
            styles.contentContainer,
            {
              backgroundColor: theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset,
              alignItems: 'center',
            },
          ]}>
          <View style={[styles.colorSchemeContainer]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => handleSlide('dark')}>
              <Text
                style={[
                  styles.colorSchemeText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                Dark{' '}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => handleSlide('system')}>
              <Text
                style={[
                  styles.colorSchemeText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                System
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => handleSlide('light')}>
              <Text
                style={[
                  styles.colorSchemeText,
                  {
                    color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                  },
                ]}>
                Light{' '}
              </Text>
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.activeSchemeStyle,
                {transform: [{translateX: sliderAnim}, {translateY: 3}]},
                {
                  backgroundColor: theme
                    ? COLORS.darkModeBackgroundOffset
                    : COLORS.lightModeBackgroundOffset,
                },
              ]}></Animated.View>
          </View>
        </View>
      </View>
      {/*  */}
      <View style={{paddingTop: 25, alignItems: 'center'}}>
        <Text
          style={[
            styles.infoHeaders,
            {
              color: theme ? COLORS.darkModeText : COLORS.lightModeText,
            },
          ]}>
          Home Screen Transactions
        </Text>
        <View
          style={[
            styles.contentContainer,
            {
              backgroundColor: theme
                ? COLORS.darkModeBackgroundOffset
                : COLORS.lightModeBackgroundOffset,
              alignItems: 'center',
            },
          ]}>
          <View
            style={[
              styles.homeScreenTxOptionContainer,
              {
                borderBottomColor: theme
                  ? COLORS.darkModeText
                  : COLORS.lightModeText,
              },
            ]}>
            <Text
              style={[
                styles.homeScreenTxOption,
                {
                  fontFamily: FONT.Descriptoin_Bold,
                  color: theme ? COLORS.darkModeText : COLORS.lightModeText,
                },
              ]}>
              Show recent:
            </Text>
          </View>
          {homeScreenTxElements}
        </View>
      </View>
    </View>
  );

  function handleSlide(type) {
    Animated.timing(sliderAnim, {
      toValue: type === 'dark' ? 3 : type === 'light' ? 220 : 113,
      duration: 200,
      useNativeDriver: true,
    }).start();
    switchColorScheme(type);
  }

  async function switchColorScheme(type) {
    try {
      // console.log(setIsDarkMode);
      if (type === 'system') {
        toggleTheme(systemTheme);
        await setLocalStorageItem('colorScheme', JSON.stringify(type));
      } else if (type === 'dark') {
        toggleTheme(true);
        await setLocalStorageItem('colorScheme', JSON.stringify('dark'));
      } else {
        toggleTheme(false);
        await setLocalStorageItem('colorScheme', JSON.stringify('light'));
      }
    } catch (err) {
      console.log(err);
    }
  }
}

function createHomepageTxOptions(activeNum, setActiveNum, theme) {
  const USEROPTIONS = [3, 5, 10, 15, 20, 25];
  if (!activeNum) return;

  return USEROPTIONS.map((num, id) => {
    return (
      <TouchableOpacity
        style={{width: '100%'}}
        onPress={() => {
          setActiveNum(num);
          handleSwitch(num);
        }}
        key={id}>
        <View
          style={[
            styles.homeScreenTxOptionContainer,
            {
              borderBottomWidth: id + 1 === USEROPTIONS.length ? 0 : 1,
              borderBottomColor: theme
                ? COLORS.darkModeText
                : COLORS.lightModeText,
            },
          ]}>
          <Text
            style={[
              styles.homeScreenTxOption,
              {
                fontFamily: FONT.Descriptoin_Regular,
                color: theme ? COLORS.darkModeText : COLORS.lightModeText,
              },
            ]}>
            {num} payments
          </Text>
          {num === activeNum && (
            <Image style={{width: 20, height: 20}} source={ICONS.checkIcon} />
          )}
        </View>
      </TouchableOpacity>
    );
  });
}

function handleSwitch(num) {
  setLocalStorageItem('homepageTxPreferace', JSON.stringify(num));
}

const styles = StyleSheet.create({
  infoHeaders: {
    width: '95%',
    fontFamily: FONT.Title_Bold,
    fontSize: SIZES.medium,
    marginBottom: 5,
  },
  contentContainer: {
    width: '95%',
    padding: 8,
    borderRadius: 8,
  },
  colorSchemeContainer: {
    width: 330,
    height: 30,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    position: 'relative',
    padding: 3,
    borderRadius: 3,
  },
  colorSchemeText: {
    width: 110,
    lineHeight: 24,
    textAlign: 'center',
    color: 'white',
    fontFamily: FONT.Title_Regular,
    fontSize: SIZES.medium,
  },
  activeSchemeStyle: {
    position: 'absolute',
    height: '100%',
    width: 107,
    top: 0,
    left: 0,
    backgroundColor: COLORS.black,
    borderRadius: 3,
    zIndex: -1,
  },
  homeScreenTxOptionContainer: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  homeScreenTxOption: {
    fontSize: SIZES.large,
  },
});
