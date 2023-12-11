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

import ReceiveFaucetHome from './receiveFaucet';
import {useState} from 'react';
import ReceievePage from './receivePage';

export default function FaucetHome(props) {
  const [recivePath, setRecievePath] = useState({
    settings: false,
    mainPage: false,
  });
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [amountPerPerson, setAmountPerPerson] = useState('');

  const [sendBTN, setSendBTN] = useState(false);
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isDisplayed}>
      <View style={styles.globalContainer}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.topBar}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => props.setFaucet(false)}>
              <Image style={[backArrow]} source={ICONS.leftCheveronIcon} />
            </TouchableOpacity>
            <Text style={[headerText, {transform: [{translateX: -12.5}]}]}>
              Faucet
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.questionText}>
              Would you like to create a send or recieve faucet?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button]}>
                <Text style={{color: COLORS.white}}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setRecievePath(prev => {
                    return {...prev, settings: true};
                  })
                }
                style={[styles.button]}>
                <Text style={{color: COLORS.white}}>Recieve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        {/* popups */}
        <ReceiveFaucetHome
          setRecievePath={setRecievePath}
          isDisplayed={recivePath.settings}
          setNumberOfPeople={setNumberOfPeople}
          setAmountPerPerson={setAmountPerPerson}
          numberOfPeople={numberOfPeople}
          amountPerPerson={amountPerPerson}
        />
        <ReceievePage
          setRecievePath={setRecievePath}
          isDisplayed={recivePath.mainPage}
          numberOfPeople={numberOfPeople}
          amountPerPerson={amountPerPerson}
          breezEvent={props.breezEvent}
          setNumberOfPeople={setNumberOfPeople}
          setAmountPerPerson={setAmountPerPerson}
          setFaucet={props.setFaucet}
        />
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
