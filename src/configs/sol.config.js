import ssjs from 'senswapjs';

const NATIVE = {
  address: ssjs.DEFAULT_EMPTY_ADDRESS,
  decimals: 9,
  name: 'Solana',
  symbol: 'SOL',
  ticket: 'solana',
  icon: 'https://assets.coingecko.com/coins/images/4128/large/coinmarketcap-solana-200.png'
}

const SOLVARS = {
  spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
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
  native: { ...NATIVE },
  ...SOLVARS,
}

/**
 * Staging configurations
 */
configs.staging = {
  node: 'https://api.devnet.solana.com',
  cluster: 'devnet',
  native: { ...NATIVE },
  ...SOLVARS,
}

/**
 * Production configurations
 */
configs.production = {
  node: 'https://api.mainnet-beta.solana.com',
  cluster: 'mainnet',
  native: { ...NATIVE },
  ...SOLVARS,
}

/**
 * Module exports
 */
export default configs;