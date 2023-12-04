import {useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {COLORS, ICONS, SIZES} from '../../../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import AboutPage from './about';

export default function SettingsContent(props) {
  const fadeAnim = useRef(new Animated.Value(600)).current;

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
          <TouchableOpacity
            onPress={() =>
              props.setSettingsContent({isDisplayed: false, for: null})
            }>
            <Image style={styles.topBarIcon} source={ICONS.leftCheveronIcon} />
          </TouchableOpacity>
          <Text style={styles.topBarText}>{props.for}</Text>
        </View>
        <ScrollView>
          {props.for?.toLowerCase() === 'about' && <AboutPage />}
        </ScrollView>
      </SafeAreaView>
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
  },
});
