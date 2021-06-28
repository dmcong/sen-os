import ssjs from 'senswapjs';

import configs from 'configs';

const util = {}

util.normalizeAppName = (appName) => {
  if (!appName) throw new Error('Application name is empty');
  if (typeof appName !== 'string') throw new Error('Application name is empty');
  return appName.replace(' ', '_').toLowerCase();
}

util.explorer = (addressOrTxId) => {
  const { sol: { cluster } } = configs;
  if (ssjs.isAddress(addressOrTxId)) {
    return `https://explorer.solana.com/address/${addressOrTxId}?cluster=${cluster}`;
  }
  return `https://explorer.solana.com/tx/${addressOrTxId}?cluster=${cluster}`;
}

export default util;