const Dotenv = require('dotenv-webpack')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    extra: {
      plugins: [
        new Dotenv({
          systemvars: true,
        }),
        new CopyPlugin({
          patterns: [
            {
              from: 'src/static/check.html',
              to: 'check.html',
            },
            {
              from: 'src/static/unsupported.html',
              to: 'unsupported.html',
            },
          ],
        }),
      ],
    },
  },
  babel: {
    env: {
      targets: {
        chrome: '88',
        ie: '11',
        ios: '12',
        safari: '13',
        firefox: '85',
      },
    },
  },
}
