import IPFSCore from 'ipfs-core'

import util from 'helpers/util'

class IPFS {
  private connection: any

  constructor() {
    this.connection = null
  }

  private _ipfs: any = async () => {
    try {
      if (!this.connection) this.connection = await IPFSCore.create()
      return this.connection
    } catch (er) {
      await util.asyncWait(500)
      return await this._ipfs()
    }
  }

  static isCID = (cid: string): boolean => {
    try {
      return IPFSCore.CID.isCID(new IPFSCore.CID(cid))
    } catch (er) {
      return false
    }
  }

  get = async (cid: string) => {
    if (!IPFS.isCID(cid)) throw new Error('Invalid CID')
    const ipfs = await this._ipfs()
    const stream = await ipfs.cat(cid)
    let raw = ''
    for await (const chunk of stream) raw += Buffer.from(chunk).toString()
    const data = JSON.parse(raw)
    return data
  }

  set = async (data: object): Promise<string> => {
    if (!data) throw new Error('Empty data')
    const raw = JSON.stringify(data)
    const ipfs = await this._ipfs()
    const { path: cid } = await ipfs.add(raw)
    return cid as string
  }
}

export default IPFS
