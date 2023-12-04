import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {CENTER, COLORS, ICONS, SIZES} from '../../../../constants';

import {useEffect, useRef, useState} from 'react';

export default function EditAmountPopup(props) {
  const [numSats, setNumSats] = useState('');
  const [description, setdescription] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  function saveChanges() {
    try {
      if (isNaN(Number(numSats))) throw Error('Not a number');
      if (numSats) props.setSendingAmount(Number(numSats) * 1000);
      else props.setSendingAmount(1000);
      if (description) props.setPaymentDescription(description);
      else props.setPaymentDescription('');

      props.setIsDisplayed(false);
    } catch (err) {
      console.log(err);
    }
  }

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

  useEffect(() => {
    if (props.isDisplayed) fadeIn();
    else fadeOut();
  }, [props.isDisplayed]);

  return (
    <Animated.View
      style={[
        styles.popupContainer,
        {opacity: fadeAnim},
        {zIndex: props.isDisplayed ? 1 : -1},
      ]}>
      <TouchableWithoutFeedback
        onPress={() => props.setIsDisplayed(false)}
        style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1, justifyContent: 'flex-end'}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeader}>Edit Payment Detials</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount (sat)"
              placeholderTextColor={COLORS.gray}
              onChangeText={setNumSats}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              placeholderTextColor={COLORS.gray}
              onChangeText={setdescription}
            />
            <TouchableOpacity
              onPress={() => {
                saveChanges();
                props.setUpdateQRCode(prev => (prev += 1));
              }}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    width: '100%',
    height: '100%',

    position: 'absolute',
    top: 0,
    left: 0,

    backgroundColor: COLORS.opaicityGray,
  },

  inputContainer: {
    width: '100%',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  inputHeader: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 35,
    marginBottom: 20,

    borderWidth: 2,
    paddingLeft: 10,

    borderRadius: 10,
  },
  saveText: {
    color: COLORS.primary,
    fontSize: SIZES.large,

    marginLeft: 'auto',
    marginBottom: 20,
  },
});