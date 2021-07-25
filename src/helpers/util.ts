import { account } from '@senswap/sen-js'
import randomColor from 'randomcolor'

import configs from 'configs'

const util = {
  randomColor: (
    seed: string,
    luminosity: string = 'dark',
    hue: string | null = null,
  ) => {
    return randomColor({ luminosity, hue, seed })
  },

  normalizeAppName: (appName: string): string => {
    if (!appName) throw new Error('Application name is empty')
    if (typeof appName !== 'string')
      throw new Error('Application name is empty')
    return appName.replace(' ', '_').toLowerCase()
  },

  explorer: (addressOrTxId: string): string => {
    const {
      sol: { cluster },
    } = configs
    if (account.isAddress(addressOrTxId)) {
      return `https://explorer.solana.com/address/${addressOrTxId}?cluster=${cluster}`
    }
    return `https://explorer.solana.com/tx/${addressOrTxId}?cluster=${cluster}`
  },

  isTouchable: () => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    )
  },

  asyncWait: (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },
}

export default util
