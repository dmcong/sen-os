import ssjs from 'senswapjs'
import { Env } from './env'

const NATIVE = {
  address: ssjs.DEFAULT_EMPTY_ADDRESS,
  decimals: 9,
  name: 'Solana',
  symbol: 'SOL',
  ticket: 'solana',
  icon: 'https://assets.coingecko.com/coins/images/4128/large/coinmarketcap-solana-200.png',
}

const SOLVARS = {
  spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
}

/**
 * Contructor
 */
type Config = {
  node: string
  cluster: 'devnet' | 'mainnet'
  native: typeof NATIVE
} & typeof SOLVARS

const configs: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    node: 'https://api.devnet.solana.com',
    cluster: 'devnet',
    native: { ...NATIVE },
    ...SOLVARS,
  },

  /**
   * Staging configurations
   */
  staging: {
    node: 'https://api.devnet.solana.com',
    cluster: 'devnet',
    native: { ...NATIVE },
    ...SOLVARS,
  },

  /**
   * Production configurations
   */
  production: {
    node: 'https://api.mainnet-beta.solana.com',
    cluster: 'mainnet',
    native: { ...NATIVE },
    ...SOLVARS,
  },
}

/**
 * Module exports
 */
export default configs
