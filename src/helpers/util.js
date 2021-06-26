import ssjs from 'senswapjs';

import configs from 'configs';

const util = {}

util.explorer = (addressOrTxId) => {
  const { sol: { cluster } } = configs;
  if (ssjs.isAddress(addressOrTxId)) {
    return `https://explorer.solana.com/address/${addressOrTxId}?cluster=${cluster}`;
  }
  return `https://explorer.solana.com/tx/${addressOrTxId}?cluster=${cluster}`;
}

export default util;