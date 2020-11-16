module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'DdkMap',
      externals: {
        react: 'React'
      }
    }
  }
}
