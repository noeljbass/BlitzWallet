import {
  defaultConfig,
  EnvironmentType,
  NodeConfigVariant,
  connect,
  mnemonicToSeed,
} from '@breeztech/react-native-breez-sdk';
import {generateMnemonic} from '@dreson4/react-native-quick-bip39';
import {btoa, toByteArray} from 'react-native-quick-base64';

export default async function connectToNode(breezEvent) {
  try {
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

    const mnemonic = generateMnemonic();
    const seed = await mnemonicToSeed(mnemonic);

    // Connect to the Breez SDK make it ready for use
    await connect(config, seed, breezEvent);

    return new Promise(resolve => {
      resolve({
        isConnected: true,
        reason: 'Connected through node',
        mnemonic: mnemonic,
      });
    });
  } catch (err) {
    return new Promise(resolve => {
      resolve({isConnected: false, reason: 'not able to connect to node'});
    });
  }
}

function unit8ArrayConverter(unitArray) {
  return Array.from(
    unitArray.filter(num => Number.isInteger(num) && num >= 0 && num <= 255),
  );
}
