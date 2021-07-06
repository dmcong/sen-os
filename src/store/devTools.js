import configs from 'configs';
import util from 'helpers/util';

// Bugfix: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu
const devTools = (appName) => {
  if (configs.env !== 'development') return false;
  return {
    name: util.normalizeAppName(appName),
    actionSanitizer: ({ payload, type }) => ({ payload, type }),
  }
}

export default devTools;