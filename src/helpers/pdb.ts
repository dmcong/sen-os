import localForage from 'localforage'
import IPFS from 'ipfs-core'

import util from 'helpers/util'

/**
 * Persistent Database
 */
class PDB {
  dbName: string
  private driver: any

  constructor(walletAddress: string) {
    this.dbName = walletAddress
    this.driver = [localForage.WEBSQL, localForage.LOCALSTORAGE]
  }

  _IPFS = async () => {
    if (!window.senos?.ipfs) window.senos.ipfs = await IPFS.create()
    return window.senos.ipfs
  }

  createInstance = (appName: string): any => {
    const instanceName = util.normalizeAppName(appName)
    return localForage.createInstance({
      driver: this.driver,
      name: this.dbName,
      storeName: instanceName,
    })
  }

  dropInstance = async (appName: string): Promise<void> => {
    const instanceName = util.normalizeAppName(appName)
    const instance = this.createInstance(appName)
    await instance.clear()
    return await localForage.dropInstance({
      name: this.dbName,
      storeName: instanceName,
    })
  }

  _getAll = async (): Promise<any> => {
    let data: any = {}
    const apps = (await this.createInstance('senos').getItem('apps'))
      .flat()
      .map((appName: string) => util.normalizeAppName(appName))
      .concat(['senos'])
    for (const app of apps) {
      data[app] = {}
      const instance = this.createInstance(app)
      await instance.iterate((value: string, key: string) => {
        data[app][key] = value
      })
    }
    return data
  }

  _setAll = async (data: any) => {
    for (const app in data) {
      const instance = await this.createInstance(app)
      for (const key in data[app]) {
        const value = data[app][key]
        await instance.setItem(key, value)
      }
    }
  }

  backup = async () => {
    // Build data
    const data = await this._getAll()
    const raw = JSON.stringify(data)
    // Upload data
    const ipfs = await this._IPFS()
    const { path: cid } = await ipfs.add(raw)
    return cid
  }

  restore = async (cid: string) => {
    // Download data
    const ipfs = await this._IPFS()
    const stream = await ipfs.cat(cid)
    let raw = ''
    for await (const chunk of stream) raw += Buffer.from(chunk).toString()
    const data = JSON.parse(raw)
    // Apply to storage
    await this._setAll(data)
    return data
  }

  static isCID = (cid: string): boolean => {
    try {
      return IPFS.CID.isCID(new IPFS.CID(cid))
    } catch (er) {
      return false
    }
  }
}

export default PDB
