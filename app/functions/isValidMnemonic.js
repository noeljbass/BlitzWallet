import {
  defaultConfig,
  EnvironmentType,
  NodeConfigVariant,
  connect,
  mnemonicToSeed,
} from '@breeztech/react-native-breez-sdk';
export default async function isValidMnemonic(mnemonic) {
  const mnemoincToString = mnemonic.join(' ');
  try {
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

    await mnemonicToSeed(mnemoincToString);

    return new Promise(resolve => {
      resolve(true);
    });
  } catch (err) {
    console.log(err);
    return new Promise(resolve => {
      resolve(false);
    });
  }
}
