import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONT, ICONS, SIZES} from '../../../../constants';
import {BTN, backArrow, headerText} from '../../../../constants/styles';
import * as Device from 'expo-device';
import {useState} from 'react';
import ReceievePage from './receivePage';
import SendPage from './sendPage';
import SettingsPage from './settingsPage';

export default function FaucetHome(props) {
  const [userPath, setUserPath] = useState({
    settings: false,
    receive: false,
    send: false,
    type: '',
  });
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [amountPerPerson, setAmountPerPerson] = useState('');

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isDisplayed}>
      <View
        style={[
          styles.globalContainer,
          {
            backgroundColor: props.isDarkMode
              ? COLORS.darkModeBackground
              : COLORS.lightModeBackground,
          },
        ]}>
        <SafeAreaView
          style={[
            {flex: 1, marginVertical: Device.osName === 'Android' ? 10 : 0},
          ]}>
          <View style={styles.topBar}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => props.setFaucet(false)}>
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
              Faucet
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <Text
              style={[
                styles.questionText,
                {
                  color: props.isDarkMode
                    ? COLORS.darkModeText
                    : COLORS.lightModeText,
                },
              ]}>
              Would you like to create a send or recieve faucet?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  return;
                  setUserPath(prev => {
                    return {...prev, settings: true, type: 'send'};
                  });
                }}
                style={[styles.button, {opacity: 0.3}]}>
                <Text style={{color: COLORS.white}}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setUserPath(prev => {
                    return {...prev, settings: true, type: 'receive'};
                  })
                }
                style={[styles.button]}>
                <Text style={{color: COLORS.white}}>Recieve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* popups */}
        <SettingsPage
          setUserPath={setUserPath}
          isDisplayed={userPath.settings}
          setNumberOfPeople={setNumberOfPeople}
          setAmountPerPerson={setAmountPerPerson}
          numberOfPeople={numberOfPeople}
          amountPerPerson={amountPerPerson}
          userPath={userPath}
          isDarkMode={props.isDarkMode}
        />
        <ReceievePage
          setUserPath={setUserPath}
          isDisplayed={userPath.receive}
          numberOfPeople={numberOfPeople}
          amountPerPerson={amountPerPerson}
          breezEvent={props.breezEvent}
          setNumberOfPeople={setNumberOfPeople}
          setAmountPerPerson={setAmountPerPerson}
          setFaucet={props.setFaucet}
          isDarkMode={props.isDarkMode}
        />
        <SendPage
          setUserPath={setUserPath}
          isDisplayed={userPath.send}
          numberOfPeople={numberOfPeople}
          amountPerPerson={amountPerPerson}
          breezEvent={props.breezEvent}
          setNumberOfPeople={setNumberOfPeople}
          setAmountPerPerson={setAmountPerPerson}
          setFaucet={props.setFaucet}
          isDarkMode={props.isDarkMode}
        />
        {/* NEED TO CREATE */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  //   topbar
  topBar: {
    width: '100%',
    flexDirection: 'row',
  },
  //   content container

  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    width: 250,
    fontSize: SIZES.medium,
    fontFamily: FONT.Title_Bold,
    textAlign: 'center',
    marginBottom: 50,
  },

  buttonContainer: {
    width: '75%',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
