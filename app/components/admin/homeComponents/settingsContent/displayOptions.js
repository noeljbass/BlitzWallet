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
import {useEffect, useRef, useState} from 'react';
import {setStatusBarStyle} from 'expo-status-bar';

export default function DisplayOptions(props) {
  const sytemColorScheme = useColorScheme();
  const sliderAnim = useRef(new Animated.Value(3)).current;

  useEffect(() => {
    (async () => {
      const activeColorScheme = await getLocalStorageItem('colorScheme');
      handleSlide(JSON.parse(activeColorScheme));
    })();
  }, []);

  return (
    <View style={{flex: 1, paddingTop: 25, alignItems: 'center'}}>
      <Text
        style={[
          styles.infoHeaders,
          {
            color: props.isDarkMode
              ? COLORS.darkModeText
              : COLORS.lightModeText,
          },
        ]}>
        Color Scheme
      </Text>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: props.isDarkMode
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
                  color: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              Dark{' '}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} onPress={() => handleSlide(null)}>
            <Text
              style={[
                styles.colorSchemeText,
                {
                  color: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
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
                  color: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
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
                backgroundColor: props.isDarkMode
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
      await setLocalStorageItem('colorScheme', JSON.stringify(type));
      if (!type) {
        const colorSceme = sytemColorScheme === 'dark';
        if (colorSceme) setStatusBarStyle('light');
        else setStatusBarStyle('dark');
        props.setIsDarkMode(colorSceme);
      } else {
        const colorSceme = type === 'dark';
        if (colorSceme) setStatusBarStyle('light');
        else setStatusBarStyle('dark');
        props.setIsDarkMode(colorSceme);
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
