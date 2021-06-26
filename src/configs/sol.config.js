import ssjs from 'senswapjs';

const NATIVE = {
  address: ssjs.DEFAULT_EMPTY_ADDRESS,
  decimals: 9,
  name: 'Solana',
  symbol: 'SOL',
  ticket: 'solana',
  icon: 'https://assets.coingecko.com/coins/images/4128/large/coinmarketcap-solana-200.png'
}

/**
 * Contructor
 */
const configs = {}

/**
 * Development configurations
 */
configs.development = {
  node: 'https://api.devnet.solana.com',
  cluster: 'devnet',
  native: { ...NATIVE }
}

/**
 * Staging configurations
 */
configs.staging = {
  node: 'https://api.devnet.solana.com',
  cluster: 'devnet',
  native: { ...NATIVE }
}

/**
 * Production configurations
 */
configs.production = {
  node: 'https://api.mainnet-beta.solana.com',
  cluster: 'mainnet',
  native: { ...NATIVE }
}

/**
 * Module exports
 */
export default configs;