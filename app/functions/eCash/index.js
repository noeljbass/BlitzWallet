import {CashuMint, CashuWallet, getEncodedToken} from '@cashu/cashu-ts';

async function getWallet() {
  const mint = new CashuMint(
    'https://legend.lnbits.com/cashu/api/v1/4gr9Xcmz3XEkUNwiBiQGoC',
  );

  const keys = await mint.getKeys();

  console.log(keys);
}

export {getWallet};
