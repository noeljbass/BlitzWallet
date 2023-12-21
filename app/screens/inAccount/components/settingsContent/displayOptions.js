import {Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {setLocalStorageItem} from '../../../../functions';
import {COLORS} from '../../../../constants';

export default function DisplayOptions(props) {
  const sytemColorScheme = useColorScheme();
  async function testing(type) {
    try {
      await setLocalStorageItem('colorScheme', JSON.stringify(type));
      if (!type) props.setIsDarkMode(sytemColorScheme === 'dark');
      else props.setIsDarkMode(type === 'dark');
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <View>
      <TouchableOpacity onPress={() => testing('dark')}>
        <Text style={{color: 'black'}}>Dark Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => testing('light')}>
        <Text style={{color: 'white'}}>light Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => testing(null)}>
        <Text
          style={{
            color: props.isDarkMode
              ? COLORS.darkModeText
              : COLORS.lightModeText,
          }}>
          sytem
        </Text>
      </TouchableOpacity>
    </View>
  );
}
