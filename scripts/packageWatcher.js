const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const env = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

/**
 * Handler
 */
const universeDir = path.join(__dirname, '../src/universe.json');
const normalizeAppName = (appName) => {
  return appName.replace(' ', '_').toLowerCase();
}
const buildMetadata = (dir) => {
  const folders = dir.split('/');
  const id = folders[folders.length - 2];
  const raw = fs.readFileSync(dir);
  const { name, version, description, keywords, author, license } = JSON.parse(raw);
  if (id != normalizeAppName(name)) throw new Error(`Unmatching the app name and the folder name: ${name} vs ${id}`);
  const metadata = { [id]: { name, version, description, keywords, author, license } };
  return metadata;
}
const readUniverse = () => {
  if (!fs.existsSync(universeDir)) return {}
  const raw = fs.readFileSync(universeDir);
  const json = JSON.parse(raw);
  return json;
}
const updateUniverse = (dir) => {
  const universe = readUniverse();
  const metadata = buildMetadata(dir);
  const newUniverse = { ...universe, ...metadata }
  const data = JSON.stringify(newUniverse, null, 2);
  fs.writeFileSync(universeDir, data);
  return newUniverse;
}

/**
 * Watcher
 */
const watchee = path.join(__dirname, '../src/applications') + '/*/package.json';
const watcher = chokidar.watch(watchee, {
  ignored: /node_modules/,
});
watcher.on('all', (_, dir) => {
  updateUniverse(dir);
});

if (env != 'development') process.exit(0);