export default {
  name: 'BlitzWallet',
  slug: 'blitzwallet',
  scheme: 'BlitzWallet',
  displayName: 'Blitz Wallet',
  version: '0.0.1',
  expo: {
    extra: {
      eas: {
        projectId: 'edf13405-7014-4f88-aee5-ec131bfc217d',
      },
      GL_CUSTOM_NOBODY_CERT: process.env.GL_CUSTOM_NOBODY_CERT,
      GL_CUSTOM_NOBODY_KEY: process.env.GL_CUSTOM_NOBODY_KEY,
      API_KEY: process.env.API_KEY,
    },
    owner: 'bkaufman20',
  },
};