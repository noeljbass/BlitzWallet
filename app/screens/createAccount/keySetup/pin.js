import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FONT, SIZES} from '../../../constants';
import {storeData} from '../../../functions';

export default function PinSetupPage({navigation: navigate}) {
  const [pin, setPin] = useState([null, null, null, null]);
  const [error, setError] = useState(false);

  function addPin(id) {
    if (typeof id != 'number') {
      setPin(prev => {
        const nullIndex = pin.indexOf(null);

        return prev.map((item, id) => {
          if (id === nullIndex - 1) {
            return null;
          } else if (nullIndex === -1 && id === 3) {
            return null;
          } else return item;
        });
      });
    } else {
      setPin(prev => {
        const nullIndex = pin.indexOf(null);

        return prev.map((number, count) => {
          if (count === nullIndex) {
            return id;
          } else return number;
        });
      });
    }
  }

  useEffect(() => {
    const filteredPin = pin.filter(pin => {
      if (typeof pin === 'number') return true;
    });

    if (filteredPin.length != 4) return;
    (async () => {
      const stored = await storeData('pin', JSON.stringify(pin));
      console.log(stored);

      if (stored) {
        console.log('TEST');

        return navigate('HomeAdmin');
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setPin([null, null, null, null]);
        }, 1000);
      }
    })();
  }, [pin]);

  return (
    <SafeAreaView style={styles.globalContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>
          {error ? 'Error saving data, try again' : 'Choose a 4-digit PIN'}
        </Text>
        <Text style={styles.subHeader}>
          PIN entry will be required for wallet access. Write it down as it
          cannot be recovered.
        </Text>
        <View style={styles.dotContainer}>
          <View
            style={
              typeof pin[0] === 'number' ? styles.dot_active : styles.dot
            }></View>
          <View
            style={
              typeof pin[1] === 'number' ? styles.dot_active : styles.dot
            }></View>
          <View
            style={
              typeof pin[2] === 'number' ? styles.dot_active : styles.dot
            }></View>
          <View
            style={
              typeof pin[3] === 'number' ? styles.dot_active : styles.dot
            }></View>
        </View>
        <View style={styles.keyboardContainer}>
          <View style={styles.keyboard_row}>
            <TouchableOpacity onPress={() => addPin(1)} style={styles.key}>
              <Text style={styles.keyText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addPin(2)} style={styles.key}>
              <Text style={styles.keyText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addPin(3)} style={styles.key}>
              <Text style={styles.keyText}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.keyboard_row}>
            <TouchableOpacity onPress={() => addPin(4)} style={styles.key}>
              <Text style={styles.keyText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addPin(5)} style={styles.key}>
              <Text style={styles.keyText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addPin(6)} style={styles.key}>
              <Text style={styles.keyText}>6</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.keyboard_row}>
            <TouchableOpacity onPress={() => addPin(7)} style={styles.key}>
              <Text style={styles.keyText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addPin(8)} style={styles.key}>
              <Text style={styles.keyText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addPin(9)} style={styles.key}>
              <Text style={styles.keyText}>9</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.keyboard_row}>
            <TouchableOpacity onPress={() => addPin(0)} style={styles.key}>
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => addPin(null)} style={styles.key}>
              <Text style={styles.keyText}>{'<--'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
  contentContainer: {
    width: '90%',
    flex: 1,
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 10,
    fontFamily: FONT.Title_Bold,
  },
  subHeader: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    opacity: 0.5,
    fontFamily: FONT.Descriptoin_Regular,

    marginBottom: 30,
  },
  dotContainer: {
    width: 120,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    borderWidth: 1,
  },
  dot_active: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    borderWidth: 1,
    backgroundColor: 'black',
  },
  keyboardContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  keyboard_row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  key: {
    width: '33.33333333333333%',
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: SIZES.xLarge,
    fontFamily: FONT.Other_Regular,
  },
});
