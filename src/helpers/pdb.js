import localForage from 'localforage';
import util from 'helpers/util';

/**
 * Persistent Database
 */

const createPDB = (appName) => {
  const dbName = util.normalizeAppName(appName);
  const db = localForage.createInstance({ name: dbName });
  db.createInstance = function (opts) {
    return localForage.createInstance({ ...opts, name: dbName });
  }
  return db;
}

const dropPDB = async (appName) => {
  const dbName = util.normalizeAppName(appName);
  const db = localForage.createInstance({ name: dbName });
  return await db.dropInstance({ name: dbName })
}

export { createPDB, dropPDB };