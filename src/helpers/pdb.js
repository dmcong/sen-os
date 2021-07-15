import localForage from 'localforage';
import IPFS from 'ipfs-core';

import util from 'helpers/util';

/**
 * Persistent Database
 */

class PDB {
  constructor(walletAddress) {
    this.dbName = walletAddress;
    this.pdb = localForage.createInstance({ name: walletAddress });
  }

  _IPFS = async () => {
    if (!window.senos?.ipfs) window.senos.ipfs = await IPFS.create();
    return window.senos.ipfs;
  }

  createInstance = (appName) => {
    const instanceName = util.normalizeAppName(appName);
    return localForage.createInstance({
      name: this.dbName,
      storeName: instanceName,
    });
  }

  dropInstance = async (appName) => {
    const instanceName = util.normalizeAppName(appName);
    return await localForage.dropInstance({
      name: this.dbName,
      storeName: instanceName,
    });
  }

  backup = async () => {
    let data = {}
    const apps = (await this.createInstance('senos').getItem('apps'))
      .flat()
      .map(appName => util.normalizeAppName(appName))
      .concat(['senos']);
    for (const app of apps) {
      data[app] = {}
      const instance = this.createInstance(app);
      await instance.iterate((value, key) => data[app][key] = value);
    }
    const raw = JSON.stringify(data);
    const ipfs = await this._IPFS();
    const { path: cid } = await ipfs.add(raw);
    return cid;
  }

  restore = async (cid) => {
    const ipfs = await this._IPFS();
    const stream = await ipfs.cat(cid);
    let raw = ''
    for await (const chunk of stream) raw += Buffer.from(chunk).toString();
    const data = JSON.parse(raw);
    return data;
  }

  static isCID = (cid) => {
    try {
      return IPFS.CID.isCID(new IPFS.CID(cid));
    } catch (er) {
      return false;
    }
  }
}

export default PDB;