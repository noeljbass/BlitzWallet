import {
  BreezEvent,
  defaultConfig,
  EnvironmentType,
  NodeConfigVariant,
  sendPayment,
  connect,
  mnemonicToSeed,
} from '@breeztech/react-native-breez-sdk';

// SDK events listener
const onBreezEvent = e => {
  console.log(`Received event ${e.type}`);
};

export default async function connectToNode() {
  console.log('TEst');

  // Create the default config
  try {
    const inviteCode = 'BA3G-HS6N';
    const apiKey =
      '8a57cc04e47bf1b4796663d8aa1e4274d440239dfc0b23426413bd0d4983fc32';
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

    const seed = await mnemonicToSeed(
      'inner crazy earth impose barely spice spoil follow junior retreat more rail',
    );

    // Connect to the Breez SDK make it ready for use
    await connect(config, seed, onBreezEvent);
  } catch (err) {
    console.log(err);
  }
}
