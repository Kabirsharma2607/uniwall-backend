import { WalletType } from '@kabir.26/uniwall-commons';
import axios from 'axios';

const COINGECKO_IDS: Record<WalletType, string> = {
  'SOL': 'solana',
  'ETH': 'ethereum',
  'BTC': 'bitcoin',
  'PALO': 'polkadot', // Assuming PALO maps to Polkadot
};

const getUsdPrice = async (wallet: WalletType): Promise<number> => {
  const id = COINGECKO_IDS[wallet];
  if (!id) throw new Error(`Invalid wallet type: ${wallet}`);

  const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: { ids: id, vs_currencies: 'usd' },
  });

  const price = data[id]?.usd;
  if (typeof price !== 'number') throw new Error(`No USD price for ${id}`);
  return price;
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