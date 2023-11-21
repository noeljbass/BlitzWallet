import {
  BreezEvent,
  defaultConfig,
  EnvironmentType,
  NodeConfigVariant,
  sendPayment,
  connect,
} from "@breeztech/react-native-breez-sdk";

// SDK events listener
const onBreezEvent = (e) => {
  console.log(`Received event ${e.type}`);
};

export default async function connectToNode(seed) {
  // Create the default config

  const inviteCode = process.env.EXPO_PUBLIC_INVITE_KEY1;
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  const nodeConfig = {
    type: NodeConfigVariant.GREENLIGHT,
    config: {
      inviteCode,
    },
  };

  const config = await defaultConfig(
    EnvironmentType.PRODUCTION,
    apiKey,
    nodeConfig
  );

  // Connect to the Breez SDK make it ready for use
  await connect(config, seed, onBreezEvent);
}
