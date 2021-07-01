// Bugfix: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu
const devTools = {
  actionSanitizer: ({ payload, type }) => ({ payload, type }),
}

export default devTools;