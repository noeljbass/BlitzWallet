import {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {COLORS, FONT, ICONS, SHADOWS, SIZES} from '../../../../constants';
import {BTN, backArrow, headerText} from '../../../../constants/styles';
import * as Device from 'expo-device';

export default function SettingsPage(props) {
  const fadeAnim = useRef(new Animated.Value(900)).current;

  const [errorMessage, setErrorMessage] = useState({
    for: null,
    message: '',
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
      toValue: 900,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function continueFilter() {
    if (!props.numberOfPeople || !props.amountPerPerson) {
      setErrorMessage(() => {
        if (!props.numberOfPeople) {
          return {
            for: 'numberOfPeople',
            message: 'Error. Please add an amount of people for the faucet.',
          };
        } else {
          return {
            for: 'amountPerPerson',
            message: 'Error. Please add an amount per person for the faucet.',
          };
        }
      });
      return;
    }

    props.setUserPath(prev => {
      if (props.userPath.type === 'receive') return {...prev, receive: true};
      else return {...prev, send: true};
    });
    setErrorMessage({
      for: null,
      message: '',
    });
    Keyboard.dismiss();
  }

  useEffect(() => {
    if (props.isDisplayed) {
      fadeIn();
    } else fadeOut();
  }, [props.isDisplayed]);
  return (
    <Animated.View
      style={[
        styles.popupContainer,
        {
          transform: [{translateX: fadeAnim}],
          backgroundColor: props.isDarkMode
            ? COLORS.darkModeBackground
            : COLORS.lightModeBackground,
        },
      ]}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={{flex: 1}}>
          <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => {
                  props.setUserPath(prev => {
                    return {...prev, settings: false};
                  });
                  props.setAmountPerPerson('');
                  props.setNumberOfPeople('');
                  setErrorMessage({
                    for: null,
                    message: '',
                  });
                }}>
                <Image style={[backArrow]} source={ICONS.leftCheveronIcon} />
              </TouchableOpacity>
              <Text
                style={[
                  headerText,
                  {
                    transform: [{translateX: -12.5}],
                    color: props.isDarkMode
                      ? COLORS.darkModeText
                      : COLORS.lightModeText,
                  },
                ]}>
                {props.userPath.type.toLowerCase() === 'receive'
                  ? 'Receive'
                  : 'Send'}{' '}
                Faucet
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <View
                style={[
                  styles.inputsContainer,
                  {marginBottom: errorMessage.message ? 50 : 'auto'},
                ]}>
                <View style={styles.inputContainer}>
                  <TextInput
                    onChangeText={props.setNumberOfPeople}
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          errorMessage.for === 'numberOfPeople'
                            ? COLORS.cancelRed
                            : COLORS.primary,
                      },
                    ]}
                    value={props.numberOfPeople}
                    keyboardType="number-pad"
                  />
                  <Text
                    style={[
                      styles.descriptionText,
                      {
                        color: props.isDarkMode
                          ? COLORS.darkModeText
                          : COLORS.lightModeText,
                      },
                    ]}>
                    Number of People
                  </Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    onChangeText={props.setAmountPerPerson}
                    style={[
                      styles.input,
                      {
                        backgroundColor:
                          errorMessage.for === 'amountPerPerson'
                            ? COLORS.cancelRed
                            : COLORS.primary,
                      },
                    ]}
                    value={props.amountPerPerson}
                    keyboardType="number-pad"
                  />
                  <Text
                    style={[
                      styles.descriptionText,
                      {
                        color: props.isDarkMode
                          ? COLORS.darkModeText
                          : COLORS.lightModeText,
                      },
                    ]}>
                    Amount Per Person
                  </Text>
                </View>
              </View>
              {errorMessage.message && (
                <Text style={styles.errorMessage}>{errorMessage.message}</Text>
              )}
              <TouchableOpacity
                onPress={continueFilter}
                style={[styles.button]}>
                <Text style={{color: COLORS.white}}>Create Faucet</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.background,
    position: 'absolute',
  },

  topBar: {
    flexDirection: 'row',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //   input
  inputsContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 'auto',
  },
  inputContainer: {
    width: '45%',
    alignItems: 'center',
  },
  input: {
    width: 100,
    height: 35,
    backgroundColor: COLORS.primary,
    marginBottom: 10,
    color: COLORS.white,
    fontFamily: FONT.Descriptoin_Regular,
    padding: 10,
    borderRadius: 8,
    ...SHADOWS.medium,
  },
  descriptionText: {
    fontFamily: FONT.Descriptoin_Regular,
    fontSize: SIZES.medium,
  },

  errorMessage: {
    width: 250,
    marginBottom: 'auto',
    color: COLORS.cancelRed,
    fontSize: SIZES.large,
    fontFamily: FONT.Descriptoin_Regular,
    textAlign: 'center',
  },

  button: {
    width: '40%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
});
