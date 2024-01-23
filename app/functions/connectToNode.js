import {
  defaultConfig,
  EnvironmentType,
  NodeConfigVariant,
  connect,
  mnemonicToSeed,
  nodeInfo,
} from '@breeztech/react-native-breez-sdk';
import {retrieveData} from './secureStore';

import {btoa, atob, toByteArray} from 'react-native-quick-base64';

export default async function connectToNode(breezEvent) {
  // Create the default config

  try {
    await nodeInfo();
    return new Promise(resolve => {
      resolve({isConnected: true, reason: null});
    });
  } catch (err) {
    try {
      // const fileInfo = await FileSystem.getInfoAsync(
      //   process.env.GL_CUSTOM_NOBODY_CERT,
      // );

      // const inviteCode = process.env.INVITE_KEY1;
      // console.log(process.env.INVITE_KEY1);
      // console.log(process.env.GL_CUSTOM_NOBODY_CERT);
      // console.log(process.env.GL_CUSTOM_NOBODY_KEY);
      // console.log(process.env.API_KEY);

      // const deviceCert = await FileSystem.readAsStringAsync(
      //   `/Users/blakekaufman/Desktop/Bliltz Wallet, LLC/Green light certifications/gl-certs/client.crt`,
      //   {
      //     encoding: FileSystem.EncodingType.Base64,
      //   },
      // );
      // const deviceKey = await FileSystem.readAsStringAsync(
      //   `/Users/blakekaufman/Desktop/Bliltz Wallet, LLC/Green light certifications/gl-certs/client-key.pem`,
      //   {
      //     encoding: FileSystem.EncodingType.Base64,
      //   },
      // );

      // const test = btoa(process.env.GL_CUSTOM_NOBODY_KEY);

      // console.log(
      //   toByteArray(deviceCert).toString() === toByteArray(test).toString(),
      //   'TESTING',
      // );

      const nodeConfig = {
        type: NodeConfigVariant.GREENLIGHT,
        config: {
          // inviteCode: inviteCode,
          partnerCredentials: {
            deviceKey: unit8ArrayConverter(
              toByteArray(btoa(process.env.GL_CUSTOM_NOBODY_KEY)),
            ),
            deviceCert: unit8ArrayConverter(
              toByteArray(btoa(process.env.GL_CUSTOM_NOBODY_CERT)),
            ),
          },
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
          errMessage: JSON.stringify(err),
          reason: 'error connecting',
        });
      });
    }
  }
}

function unit8ArrayConverter(unitArray) {
  return Array.from(
    unitArray.filter(num => Number.isInteger(num) && num >= 0 && num <= 255),
  );
}
