import { DEFAULT_EMPTY_ADDRESS } from '@senswap/sen-js'
import { Env } from './env'

const NATIVE = {
  address: DEFAULT_EMPTY_ADDRESS,
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
  cluster: 'devnet' | 'testnet' | 'mainnet'
  chainId: 101 | 102 | 103
  native: typeof NATIVE
} & typeof SOLVARS

const configs: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    node: 'https://api.devnet.solana.com',
    chainId: 103,
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
    chainId: 103,
    native: { ...NATIVE },
    ...SOLVARS,
  },

  /**
   * Production configurations
   */
  production: {
    node: 'https://api.mainnet-beta.solana.com',
    cluster: 'mainnet',
    chainId: 101,
    native: { ...NATIVE },
    ...SOLVARS,
  },
}

/**
 * Module exports
 */
export default configs
