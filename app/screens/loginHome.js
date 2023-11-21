import {Text, View} from 'react-native';
import connectToNode from '../functions/connectToNode';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';

export default function LoginHome() {
  // connectToNode();

  // (async () => {
  //   try {
  //     const nodeId = await nodeInfo();
  //     console.log(nodeId, 'TTT');
  //   } catch (err) {
  //     console.log(err, 'TT');
  //   }
  // })();

  return (
    <View>
      <Text>Login Home</Text>
    </View>
  );
}
