/// <reference types="react-scripts" />

declare module 'sen-kit'
declare module 'senswapjs'
declare module 'react-copy-to-clipboard'
declare module 'remarkable'
declare module 'randomcolor'
declare module 'numeral'
declare module 'flexsearch'

interface Window {
  senos: {
    wallet: any
    lamports: any
    splt: any
    ipfs?: any
  }
}

type AppInfo = {
  appName: string
  version: string
  description: string
  keywords: string[]
  author: {
    name: string
    email: string
  }
  license?: string
}
type Universe = Record<string, AppInfo>
