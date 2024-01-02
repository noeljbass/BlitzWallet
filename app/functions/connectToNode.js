import {
  BreezEvent,
  defaultConfig,
  EnvironmentType,
  NodeConfigVariant,
  connect,
  mnemonicToSeed,
  nodeInfo,
} from '@breeztech/react-native-breez-sdk';
// import Config from 'react-native-config';
import {retrieveData} from './secureStore';
import {INVITE_KEY1, API_KEY} from '@env';

export default async function connectToNode(breezEvent) {
  // Create the default config
  // console.log(INVITE_KEY1, API_KEY);

  try {
    const nodeInformation = await nodeInfo();
    console.log(nodeInformation);
    return new Promise(resolve => {
      resolve({isConnected: true, reason: null});
    });
  } catch (err) {
    try {
      console.log('ERR');
      const inviteCode = process.env.INVITE_KEY1;
      const nodeConfig = {
        type: NodeConfigVariant.GREENLIGHT,
        config: {
          inviteCode: inviteCode,
        },
      };

      const config = await defaultConfig(
        EnvironmentType.PRODUCTION,
        process.env.API_KEY,
        nodeConfig,
      );

      const mnemonic = await retrieveData('mnemonic');
      console.log(mnemonic);

      if (mnemonic) {
        const seed = await mnemonicToSeed(mnemonic);
        // console.log(mnemonic);

        // Connect to the Breez SDK make it ready for use
        await connect(config, seed, breezEvent);
        return new Promise(resolve => {
          resolve({isConnected: true, reason: 'Connected through node'});
        });
      } else {
        console.log('no Mneomincs');
        return new Promise(resolve => {
          resolve({isConnected: false, reason: 'No mnemonic'});
        });
      }
    } catch (err) {
      console.log(err, 'connect to node err');
      connectToNode();
      return new Promise(resolve => {
        resolve({isConnected: false, reason: 'error connecting'});
      });
    }
  }
}
