import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {getLocalStorageItem, setLocalStorageItem} from '../../../../functions';
import {CENTER, COLORS, FONT, SIZES} from '../../../../constants';
import {useContext, useEffect, useRef, useState} from 'react';
import {useTheme} from '../../../../../context-store/context';

export default function DisplayOptions() {
  // const sytemColorScheme = useColorScheme();
  const sliderAnim = useRef(new Animated.Value(3)).current;
  const {theme, toggleTheme} = useTheme();
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

  return (
    <View style={{flex: 1, paddingTop: 25, alignItems: 'center'}}>
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
});
