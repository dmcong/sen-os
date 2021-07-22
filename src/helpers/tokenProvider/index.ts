import { Document } from 'flexsearch'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'

import configs from 'configs'
import supplementary from './supplementary'

const {
  sol: { chainId, cluster },
} = configs
const PRESET = {
  tokenize: 'full',
  context: true,
  minlength: 3,
}
const DOCUMENT = {
  document: {
    id: 'address',
    index: [
      { field: 'symbol', ...PRESET },
      { field: 'name', ...PRESET },
    ],
  },
}

class TokenProvider {
  private tokenList: TokenInfo[]
  private engine: typeof Document | null
  readonly chainId: typeof chainId
  readonly cluster: typeof cluster

  constructor() {
    this.tokenList = []
    this.engine = null
    this.chainId = chainId
    this.cluster = cluster
  }

  private _init = async () => {
    if (this.tokenList.length) return this.tokenList
    const tokenList = await (await new TokenListProvider().resolve())
      .filterByChainId(this.chainId)
      .getList()
    if (this.cluster === 'devnet')
      this.tokenList = tokenList.concat(supplementary)
    return this.tokenList
  }

  private _engine = async () => {
    if (this.engine) return this.engine
    const tl = await this._init()
    this.engine = new Document(DOCUMENT)
    tl.forEach(({ address, ...doc }) => this.engine.add(address, doc))
    return this.engine
  }

  all = async () => {
    return await this._init()
  }

  findByAddress = async (addr: string) => {
    const tl = await this._init()
    return tl.find(({ address }) => address === addr)
  }

  find = async (keyword: string, limit?: 10) => {
    const tl = await this._init()
    const engine = await this._engine()
    const raw: Array<{ result: string[] }> = engine.search(keyword, limit)
    let tokens: TokenInfo[] = []
    raw.forEach(({ result }) => {
      return result.forEach((id: string) => {
        if (tokens.findIndex(({ address }) => address === id) < 0) {
          const token = tl.find(({ address }) => address === id)
          if (token) tokens.push(token)
        }
      })
    })
    return tokens
  }
}

export default TokenProvider
