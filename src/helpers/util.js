import ssjs from 'senswapjs';
import randomColor from 'randomcolor';

import configs from 'configs';

const util = {}

util.randomColor = (seed, luminosity = 'dark', hue = null) => {
  return randomColor({ luminosity, hue, seed });
}

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

util.isTouchable = () => {
  return ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);
}

util.asyncWait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default util;