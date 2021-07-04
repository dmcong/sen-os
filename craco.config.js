const CracoAlias = require('craco-alias');
const CracoLessPlugin = require('craco-less');
const theme = require('sen-kit/styles/theme.js');
const { compilerOptions: { baseUrl } } = require('./jsconfig.json');


module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'jsconfig',
        baseUrl
      }
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: theme,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
}