import {SafeAreaView, StyleSheet, Text, View, Platform} from 'react-native';
import {Back_BTN, Continue_BTN, KeyContainer} from '../../../components/login';
import {Background, FONT, SIZES} from '../../../constants';
import {useState} from 'react';
import {storeData, retrieveData} from '../../../functions/secureStore';
import generateMnemnoic from '../../../functions/seed';

export default function GenerateKey({navigation: {navigate}}) {
  // userAuth();
  const [mnemonic, setMnemonic] = useState([]);
  const [fetchError, setFetchError] = useState(false);

  useState(async () => {
    if (await retrieveData('mnemonic')) {
      const keys = await retrieveData('mnemonic');

      setMnemonic(keys.split(' '));

      return;
    }
    getMnemnoic();
  }, []);

  async function getMnemnoic() {
    try {
      const mnemonic = await generateMnemnoic();
      setMnemonic(mnemonic.split(' '));
      storeData('mnemonic', mnemonic);
    } catch (err) {
      setFetchError(true);
    }
  }
  console.log(mnemonic);
  return (
    <View style={Background}>
      <SafeAreaView
        style={[
          styles.global_container,
          {paddingBottom: Platform.OS === 'ios' ? 0 : 15},
        ]}>
        <Back_BTN navigation={navigate} destination="StartKeyGeneration" />
        <View style={styles.container}>
          <Text style={styles.header}>This is your recovery phrase</Text>
          <Text style={styles.subHeader}>
            Make sure to write it down as shown here. You have to verify this
            later.
          </Text>
          {!fetchError && <KeyContainer keys={mnemonic} />}
          {fetchError && (
            <View>
              <Text>Error Fetching seedphrase</Text>
            </View>
          )}
          <Continue_BTN
            navigation={navigate}
            text="Verify"
            destination="VerifyKey"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  global_container: {
    flex: 1,
  },
  container: {
    width: '90%',
    flex: 1,
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    justifyContent: 'center',
  },

  header: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.Title_Bold,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: SIZES.medium,
    fontFamily: FONT.Descriptoin_Regular,
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: 20,
  },
});
