import * as Crypto from "expo-crypto";

async function generateMnemnoic() {
  // Generate a random 32-byte entropy
  const entropyArray = await Crypto.getRandomBytesAsync(12);

  const wordList = process.env.EXPO_PUBLIC_WORD_LIST.split(" ");

  // Create a simple mnemonic by taking the first 12 words from the entropy
  const mnemonic = Array.from(entropyArray)
    .map((byte) => wordList[byte % wordList.length])
    .join(" ");

  return new Promise((resolve, reject) => {
    resolve(mnemonic);
  });
}

async function mnemonicToSeed(mnemonic) {
  try {
    // Use Crypto.digestStringAsync to create a seed from the mnemonic
    const seed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      mnemonic
    );

    return seed;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export { generateMnemnoic, mnemonicToSeed };
