/**
 * Contructor
 */
const configs = {
  /**
   * Development configurations
   */
  development: {
    base: 'http://localhost:3001',
    baseBoard: 'http://18.117.93.162:9090/stat/reports',
  },

  /**
   * Staging configurations
   */
  staging: {
    base: 'https://api.senswap.xyz',
    baseBoard: 'https://stat.senswap.xyz/stat/reports',
  },

  /**
   * Production configurations
   */
  production: {
    base: 'https://api.senswap.com',
    baseBoard: 'https://stat.senswap.com/stat/reports',
  },
}

/**
 * Module exports
 */
export default configs
