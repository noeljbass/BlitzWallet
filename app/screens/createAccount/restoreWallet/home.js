import {SafeAreaView, Text, View, TouchableOpacity} from 'react-native';
import {Back_BTN} from '../../../components/login';
import {storeData} from '../../../functions';

export default function RestoreWallet({navigation: {navigate}}) {
  // navigate('DisclaimerPage');

  function login() {
    storeData(
      'mnemonic',
      'enroll common snap embody ritual element exhaust start glove safe grunt quantum',
    );
    storeData('pin', JSON.stringify([1, 2, 3, 4]));
    navigate('HomeAdmin');
  }
  return (
    <View>
      <SafeAreaView>
        <Back_BTN navigation={navigate} destination="Home" />
        <TouchableOpacity onPress={login}>
          <Text>Restore wallet</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
