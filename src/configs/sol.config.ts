import { Env } from './env'

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
  swapAddress: string
} & typeof SOLVARS

const configs: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    node: 'https://api.devnet.solana.com',
    chainId: 103,
    cluster: 'devnet',
    ...SOLVARS,
    swapAddress: 'D8UuF1jPr5gtxHvnVz3HpxP2UkgtxLs9vwz7ecaTkrGy',
  },

  /**
   * Staging configurations
   */
  staging: {
    node: 'https://api.devnet.solana.com',
    cluster: 'devnet',
    chainId: 103,
    ...SOLVARS,
    swapAddress: 'D8UuF1jPr5gtxHvnVz3HpxP2UkgtxLs9vwz7ecaTkrGy',
  },

  /**
   * Production configurations
   */
  production: {
    node: 'https://api.mainnet-beta.solana.com',
    cluster: 'mainnet',
    chainId: 101,
    ...SOLVARS,
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
  },
}

/**
 * Module exports
 */
export default configs
