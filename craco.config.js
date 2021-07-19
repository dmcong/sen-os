const CracoAlias = require('craco-alias');
const CracoLessPlugin = require('craco-less');
const theme = require('sen-kit/styles/theme.js');
const { compilerOptions: { baseUrl } } = require('./tsconfig.json');


module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl,
        tsConfigPath: './tsconfig.json'
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