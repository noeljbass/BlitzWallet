import {Text, View} from 'react-native';
import connectToNode from '../functions/connectToNode';
import {nodeInfo} from '@breeztech/react-native-breez-sdk';

export default function Testing({navigation: {navigate}}) {
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
      <Text>testPage</Text>
    </View>
  );
}
