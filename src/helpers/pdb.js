import localForage from 'localforage';
import util from 'helpers/util';

/**
 * Persistent Database
 */

const createPDB = (dbName) => {
  const db = localForage.createInstance({ name: dbName });
  db.createInstance = opts => localForage.createInstance({ ...opts, name: dbName });
  return db;
}

const dropInstance = async (appName) => {
  const dbName = util.normalizeAppName(appName);
  const db = localForage.createInstance({ name: dbName });
  return await db.dropInstance({ name: dbName })
}

export { createPDB, dropInstance };