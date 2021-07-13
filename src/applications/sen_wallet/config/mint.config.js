import configs from 'configs';

const { env } = configs;

const mint = {}

/**
 * Development mint
 */
mint.development = [
  {
    ticket: 'bitcoin',
    symbol: 'WBTC',
    name: 'Bitcoin',
    address: '8jk4eJymMfNZV9mkRNxJEt2VJ3pRvdJvD5FE94GXGBPM',
  },
  {
    ticket: 'ethereum',
    symbol: 'WETH',
    name: 'Ethereum',
    address: '27hdcZv7RtuMp75vupThR3T4KLsL61t476eosMdoec4c',
  },
  {
    ticket: 'dai',
    symbol: 'SEN',
    name: 'Sen',
    address: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  },
  {
    ticket: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    address: 'FVZFSXu3yn17YdcxLD72TFDUqkdE5xZvcW18EUpRQEbe',
  },
  {
    ticket: 'pancakeswap-token',
    symbol: 'CAKE',
    name: 'PancakeSwap',
    address: '2z6Ci38Cx6PyL3tFrT95vbEeB3izqpoLdxxBkJk2euyj',
  },
  {
    ticket: 'solana',
    symbol: 'WSOL',
    name: 'Wrapped Solana',
    address: 'So11111111111111111111111111111111111111112',
  }
]

/**
 * Production mint
 */
mint.production = [
  {

  }
]

export default mint[env];