/**
 * Contructor
 */
const configs = {}

/**
 * Development configurations
 */
configs.development = {
  subversion: 'devnet',
}

/**
 * Staging configurations
 */
configs.staging = {
  subversion: 'devnet',
}

/**
 * Production configurations
 */
configs.production = {
  subversion: 'mainnet',
}

/**
 * Module exports
 */
export default configs;