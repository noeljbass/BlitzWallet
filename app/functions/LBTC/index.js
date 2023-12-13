import axios from 'axios';

export async function getSwapFee() {
  try {
    const request = await axios.get(
      'https://api.boltz.exchange/getfeeestimation',
    );
    const data = request.data;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
export async function getSwapPairInformation() {
  try {
    const request = await axios.get('https://api.boltz.exchange/getpairs');
    const data = request.data.pairs['L-BTC/BTC'];
    return new Promise(resolve => {
      resolve(data);
    });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

export async function createLiquidSwap(invoice) {
  try {
    const request = await axios.post('https://api.boltz.exchange/createswap', {
      type: 'submarine',
      pairId: 'L-BTC/BTC',
      orderSide: 'sell',
      invoice: invoice,
    });
    const data = request.data.pairs['L-BTC/BTC'];
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
