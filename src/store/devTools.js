import configs from 'configs';

// Bugfix: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu
const devTools = (appName = 'SenOS') => {
  if (configs.env !== 'development') return false;
  return {
    name: appName,
    actionSanitizer: ({ payload, type }) => ({ payload, type }),
  }
}

export default devTools;