import {StyleSheet, Text, View} from 'react-native';
import {KeyContainer} from '../../../../components/login';
import {retrieveData} from '../../../../functions';
import {useEffect, useState} from 'react';
import {COLORS, FONT, SIZES} from '../../../../constants';

export default function RecoveryPage(props) {
  const [mnemonic, setMnemonic] = useState([]);

  useEffect(() => {
    (async () => {
      const mnemonic = await retrieveData('mnemonic');
      setMnemonic(mnemonic.split(' '));
    })();
  }, []);

  //   console.log(mnemonic);
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.headerPhrase,
          {marginBottom: 15, fontSize: SIZES.xLarge, textAlign: 'center'},
        ]}>
        Keep this phrase in a secure and safe place
      </Text>
      <Text
        style={[
          styles.headerPhrase,
          {marginBottom: 50, fontSize: SIZES.medium, color: COLORS.cancelRed},
        ]}>
        Do not shre it with anyone
      </Text>
      <KeyContainer keys={mnemonic} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },

  headerPhrase: {
    fontFamily: FONT.Title_Regular,
  },
});
