import {
  defaultConfig,
  EnvironmentType,
  NodeConfigVariant,
  connect,
  mnemonicToSeed,
  nodeInfo,
} from '@breeztech/react-native-breez-sdk';
// import Config from 'react-native-config';
import {retrieveData} from './secureStore';

import * as FileSystem from 'expo-file-system';
import {btoa, atob, toByteArray} from 'react-native-quick-base64';

export default async function connectToNode(breezEvent) {
  // Create the default config
  // console.log(INVITE_KEY1, API_KEY);

  try {
    await nodeInfo();
    return new Promise(resolve => {
      resolve({isConnected: true, reason: null});
    });
  } catch (err) {
    try {
      // console.log(process.env.GL_CUSTOM_NOBODY_CERT, 'IN FUNCTION');
      const inviteCode = process.env.INVITE_KEY1;
      console.log(inviteCode);
      console.log(process.env.API_KEY);
      // const deviceCert = await FileSystem.readAsStringAsync(
      //   `file:${process.env.GL_CUSTOM_NOBODY_CERT}`,
      //   {
      //     encoding: FileSystem.EncodingType.Base64,
      //   },
      // );
      // const deviceKey = await FileSystem.readAsStringAsync(
      //   `file:${process.env.GL_CUSTOM_NOBODY_KEY}`,
      //   {
      //     encoding: FileSystem.EncodingType.Base64,
      //   },
      // );

      const nodeConfig = {
        type: NodeConfigVariant.GREENLIGHT,
        config: {
          inviteCode: inviteCode,
          // partnerCredentials: {
          //   deviceKey: unit8ArrayConverter(toByteArray(deviceKey)),
          //   deviceCert: unit8ArrayConverter(toByteArray(deviceCert)),
          // },
        },
      };

      const config = await defaultConfig(
        EnvironmentType.PRODUCTION,
        process.env.API_KEY,
        nodeConfig,
      );

      const mnemonic = await retrieveData('mnemonic');

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
      // connectToNode();
      return new Promise(resolve => {
        resolve({
          isConnected: false,
          reason: 'error connecting',
        });
      });
    }
  }
}
