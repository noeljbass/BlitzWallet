import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  BTN,
  CENTER,
  COLORS,
  FONT,
  ICONS,
  SIZES,
  SHADOWS,
} from '../../../constants';
import {useEffect, useRef, useState} from 'react';

const NAVITEMS = [{name: 'Github', link: 'URL', icon: ICONS.Checkcircle}];

export function OptionsDropdown(props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navElements = NAVITEMS.map((item, id) => {
    return (
      <View key={id}>
        <Text>{item.name}</Text>
        <Image source={item.icon} style={{width: 20, height: 20}} />
      </View>
    );
  });

  useEffect(() => {
    if (props.isDisplayed) {
      fadeIn();
    } else fadeOut();
  }, [props.isDisplayed]);

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
  function fadeOut() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  return (
    <TouchableWithoutFeedback
    //   onPress={() =>
    //     props.setNavViews(prev => {
    //       return {...prev, features: !prev.features};
    //     })}
    >
      <Animated.View
        style={[
          styles.globalContainer,
          {display: props.isDisplayed ? 'flex' : 'none'},
        ]}>
        <ScrollView style={styles.innerContainer}>{navElements}</ScrollView>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    // backgroundColor: COLORS.gray,
    width: 150,
    height: 200,
    position: 'absolute',
    top: '80%',
    right: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    height: '100%',

    padding: 20,

    ...SHADOWS.medium,

    backgroundColor: COLORS.gray,
  },
  navItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
