import localForage from 'localforage'
import IPFS from 'ipfs-core'
import ssjs from 'senswapjs'

import util from 'helpers/util'

/**
 * Persistent Database
 */
class PDB {
  readonly dbName: string
  private driver: any

  constructor(walletAddress: string) {
    if (!ssjs.isAddress(walletAddress)) throw new Error('Invalid address')
    this.dbName = walletAddress
    this.driver = [localForage.WEBSQL, localForage.LOCALSTORAGE]
  }

  private _ipfs = async () => {
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

  all = async (): Promise<any> => {
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

  backup = async () => {
    const data = await this.all()
    const ipfs = await this._ipfs()
    return await ipfs.set(data)
  }

  restore = async (cid: string) => {
    // Download data
    const ipfs = await this._ipfs()
    const data = await ipfs.get(cid)
    // Apply to storage
    for (const app in data) {
      const instance = await this.createInstance(app)
      for (const key in data[app]) {
        const value = data[app][key]
        await instance.setItem(key, value)
      }
    }
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
