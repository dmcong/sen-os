import { Env } from 'configs/env'

const SOLVARS = {
  spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
}

/**
 * Contructor
 */
type Config = {
  node: string
  swapAddress: string
  routingAddress: string
} & typeof SOLVARS

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    node: 'https://api.devnet.solana.com',
    ...SOLVARS,
    routingAddress: 'jwGVStpKdSmUgj7FXEo5awvwE6JkB1WrKm5oATTfHKx',
    swapAddress: 'D8UuF1jPr5gtxHvnVz3HpxP2UkgtxLs9vwz7ecaTkrGy',
  },

  /**
   * Staging configurations
   */
  staging: {
    node: 'https://api.devnet.solana.com',
    ...SOLVARS,
    routingAddress: 'jwGVStpKdSmUgj7FXEo5awvwE6JkB1WrKm5oATTfHKx',
    swapAddress: 'D8UuF1jPr5gtxHvnVz3HpxP2UkgtxLs9vwz7ecaTkrGy',
  },

  /**
   * Production configurations
   */
  production: {
    node: 'https://api.mainnet-beta.solana.com',
    ...SOLVARS,
    routingAddress: '',
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
  },
}

/**
 * Module exports
 */
export default config
