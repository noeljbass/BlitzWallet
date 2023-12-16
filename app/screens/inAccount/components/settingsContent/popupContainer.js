import {useRef, useEffect} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BTN, COLORS, ICONS} from '../../../../constants';
import {backArrow} from '../../../../constants/styles';

export default function InfoPopup(props) {
  const fadeAnim = useRef(new Animated.Value(900)).current;

  function fadeIn() {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
  function fadeout() {
    Animated.timing(fadeAnim, {
      toValue: 900,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (props.isDisplayed) fadeIn();
    else fadeout();
  }, [props.isDisplayed]);

  return (
    <Animated.View
      style={[popupStyles.container, {transform: [{translateY: fadeAnim}]}]}>
      <SafeAreaView style={popupStyles.innerContainer}>
        {props.type === 'LSPInfo' && (
          <WhatIsAnLSP setDisplayPopup={props.setDisplayPopup} />
        )}
      </SafeAreaView>
    </Animated.View>
  );
}

function WhatIsAnLSP(props) {
  return (
    <View style={popupStyles.popupContentContainer}>
      <TouchableOpacity
        onPress={() => props.setDisplayPopup({isDisplayed: false, type: ''})}>
        <Image
          style={[backArrow, {marginBottom: 20, marginLeft: 0}]}
          source={ICONS.leftCheveronIcon}
        />
      </TouchableOpacity>
      <Text>An lsp is an ____</Text>
    </View>
  );
}

const popupStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // top: 0,
    left: 0,

    backgroundColor: COLORS.opaicityGray,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  popupContentContainer: {
    width: '80%',
    height: 'auto',
    backgroundColor: COLORS.white,

    padding: 10,
    borderRadius: 8,
  },
});
