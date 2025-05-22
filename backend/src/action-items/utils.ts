import { WalletType } from '@kabir.26/uniwall-commons';
// import axios from 'axios';
import { CurrencyRate } from '../types';
import { getUserWallets } from '../router/wallet/db';

// const COINGECKO_IDS: Record<WalletType, string> = {
//   'SOL': 'solana',
//   'ETH': 'ethereum',
//   'BTC': 'bitcoin',
//   'PALO': 'polkadot', // Assuming PALO maps to Polkadot
// };

const USDPrice = {
  "SOL" : 176.63,
  "ETH" : 2663.31,
  "PALO" : 4.90,
  "BTC" : 111754.80,
}

const getUsdPrice = async (wallet: WalletType): Promise<number> => {
  // const id = COINGECKO_IDS[wallet];
  // if (!id) throw new Error(`Invalid wallet type: ${wallet}`);

  // const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
  //   params: { ids: id, vs_currencies: 'usd' },
  // });

  // const price = data[id]?.usd;
  const price = USDPrice[wallet];
  // if (typeof price !== 'number') throw new Error(`No USD price for ${id}`);
  return price;
};

export const getConversionRates = async (userId: bigint) : Promise<CurrencyRate[]> => {
  const userWallets = await getUserWallets(userId);

  const prices : CurrencyRate[] = [];

  for (const userWallet of userWallets) {
    prices.push({walletType: userWallet.walletType, balance: (await getUsdPrice(userWallet.walletType)).toString(), walletAddress: userWallet.walletPublicAddress})
  }

  return prices;

};

export const convertCurrency = async (
  amount: number,
  from: WalletType,
  to: WalletType
): Promise<number> => {
  const [fromPrice, toPrice] = await Promise.all([
    getUsdPrice(from),
    getUsdPrice(to),
  ]);
  return (amount * fromPrice) / toPrice;
};