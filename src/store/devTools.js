import configs from 'configs';

// Bugfix: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu
const devTools = configs.env === 'development' ? {
  actionSanitizer: ({ payload, type }) => ({ payload, type }),
} : false;

export default devTools;