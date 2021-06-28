const CracoLessPlugin = require('craco-less');
const theme = require('./src/static/styles/theme.js');

module.exports = {
  webpack: {
    configure: {
      entry: {
        main: './src/index.js',
        pokemon: './src/applications/pokemon_deck/index.js',
      },
    }
  },
  plugins: [
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