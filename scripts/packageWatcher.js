const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const { printError, printInfo } = require('./print')

const env = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development'

/**
 * Handler
 */
const universeDir = path.join(__dirname, '../src/universe.json')
const normalizeAppName = (appName) => {
  return appName.replace(' ', '_').toLowerCase()
}
const buildMetadata = (id) => {
  const dir = path.join(__dirname, `../src/applications/${id}/package.json`)
  const raw = fs.readFileSync(dir)
  const { name, appName, version, description, keywords, author, license } =
    JSON.parse(raw)
  if (id != name) {
    printError(
      `Error: Cannot match the module name and the folder name: ${name} vs ${id}`,
    )
    process.exit(1)
  }
  if (id != normalizeAppName(appName)) {
    printError(
      `Error: Cannot match the app name and the folder name: ${appName} vs ${id}`,
    )
    process.exit(1)
  }
  return { [id]: { appName, version, description, keywords, author, license } }
}
const readUniverse = () => {
  if (!fs.existsSync(universeDir)) return {}
  const raw = fs.readFileSync(universeDir)
  const json = JSON.parse(raw)
  return json
}
const updateUniverse = (dir, unlink = false) => {
  // Parse id & universe
  let folders = dir.split('/')
  if (folders[folders.length - 1] == 'package.json') folders.pop()
  const id = folders[folders.length - 1]
  let universe = readUniverse()
  // Handle changes
  if (unlink) delete universe[id]
  else universe = { ...universe, ...buildMetadata(id) }
  // Update universe
  const data = JSON.stringify(universe, null, 2)
  fs.writeFileSync(universeDir, data)
  printInfo('Successfully build universe.json')
  return universe
}

/**
 * Start for the first time
 */
if (fs.existsSync(universeDir)) fs.unlinkSync(universeDir)
const appNames = fs
  .readdirSync(path.join(__dirname, '../src/applications'))
  .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
appNames.forEach((appName) => {
  const dir = path.join(__dirname, '../src/applications', appName)
  updateUniverse(dir)
})

/**
 * Watcher
 */
const fileWatchee =
  path.join(__dirname, '../src/applications') + '/*/package.json'
const fileWatcher = chokidar.watch(fileWatchee, { ignored: /node_modules/ })
fileWatcher
  .on('add', (dir) => updateUniverse(dir))
  .on('change', (dir) => updateUniverse(dir))
  .on('unlink', (dir) => updateUniverse(dir, true))

/**
 * Patch
 * chokidar cannot detect package.json unlink when deleleting parent folders
 */
const dirWatchee = path.join(__dirname, '../src/applications') + '/*'
const dirWatcher = chokidar.watch(dirWatchee, { ignoreInitial: true })
dirWatcher
  .on('addDir', (dir) => updateUniverse(dir))
  .on('unlinkDir', (dir) => updateUniverse(dir, true))

if (env != 'development') process.exit(0)
