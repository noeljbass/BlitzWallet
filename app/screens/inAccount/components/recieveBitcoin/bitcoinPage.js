import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function BitcoinPage(props) {
  return (
    <View
      style={{
        display: props.selectedRecieveOption === 'bitcoin' ? 'flex' : 'none',
      }}>
      <Text>bitcoin</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
