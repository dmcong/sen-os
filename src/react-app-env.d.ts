/// <reference types="react-scripts" />

declare module '@senswap/sen-ui'
declare module 'react-copy-to-clipboard'
declare module 'remarkable'
declare module 'randomcolor'
declare module 'numeral'
declare module 'flexsearch'


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
