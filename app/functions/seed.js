import * as Crypto from 'expo-crypto';
import Config from 'react-native-config';

export default async function generateMnemnoic() {
  // Generate a random 32-byte entropy
  try {
    const entropyArray = await Crypto.getRandomBytesAsync(12);

    const wordList = Config.WORD_LIST.split(' ');

    // Create a simple mnemonic by taking the first 12 words from the entropy
    const mnemonic = Array.from(entropyArray)
      .map(byte => wordList[byte % wordList.length])
      .join(' ');

    return new Promise((resolve, reject) => {
      resolve(mnemonic);
    });
  } catch (err) {
    console.log(err);
  }
}
