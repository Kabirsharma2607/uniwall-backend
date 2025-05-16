import { wallet_type } from "@prisma/client";
import axios from 'axios';

const COINGECKO_IDS: Record<wallet_type, string> = {
  [wallet_type.SOL]: 'solana',
  [wallet_type.ETH]: 'ethereum',
  [wallet_type.BTC]: 'bitcoin',
  [wallet_type.PALO]: 'polkadot', // Assuming PALO maps to Polkadot
};

export async function convertCurrency(
  amount: number,
  from: wallet_type,
  to: wallet_type
): Promise<number> {
  try {
    const fromId = COINGECKO_IDS[from];
    const toId = COINGECKO_IDS[to];

    if (!fromId || !toId) {
      throw new Error(`Invalid wallet types: ${from}, ${to}`);
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: `${fromId},${toId}`,
          vs_currencies: 'usd',
        },
      }
    );

    const fromPrice = response.data[fromId].usd;
    const toPrice = response.data[toId].usd;

    const converted = (amount * fromPrice) / toPrice;
    return converted;
  } catch (err) {
    console.log('Error fetching rates from CoinGecko:', err);
    throw new Error('Failed to fetch conversion rates.');
  }
}
