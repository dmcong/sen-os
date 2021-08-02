import { Env } from 'configs/env'

/**
 * Contructor
 */
type Config = {
  senAddress: string
}

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    senAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  },

  /**
   * Staging configurations
   */
  staging: {
    senAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
  },

  /**
   * Production configurations
   */
  production: {
    senAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
  },
}

/**
 * Module exports
 */
export default config
