import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function LiquidPage(props) {
  return (
    <View
      style={{
        display: props.selectedRecieveOption === 'liquid' ? 'flex' : 'none',
      }}>
      <Text>Liquid</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
