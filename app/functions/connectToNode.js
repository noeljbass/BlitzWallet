import {
  BreezEvent,
  defaultConfig,
  EnvironmentType,
  NodeConfigVariant,
  sendPayment,
  connect,
  mnemonicToSeed,
} from '@breeztech/react-native-breez-sdk';
// import Config from 'react-native-config';
import {retrieveData} from './secureStore';
import {INVITE_KEY1, API_KEY} from '@env';

// SDK events listener
const onBreezEvent = e => {
  console.log(`Received event ${e.type}`);
};

export default async function connectToNode() {
  // Create the default config
  try {
    const inviteCode = INVITE_KEY1;
    const apiKey = API_KEY;
    const nodeConfig = {
      type: NodeConfigVariant.GREENLIGHT,
      config: {
        inviteCode: inviteCode,
      },
    };

    const config = await defaultConfig(
      EnvironmentType.PRODUCTION,
      apiKey,
      nodeConfig,
    );

    const mnemonic = await retrieveData('mnemonic');

    if (mnemonic) {
      const seed = await mnemonicToSeed(mnemonic);

      // Connect to the Breez SDK make it ready for use
      await connect(config, seed, onBreezEvent);
    } else {
      console.log('no Mneomincs');
    }
  } catch (err) {
    console.log(err, 'connect to node error');
  }
}
