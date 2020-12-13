const devConfigs = require('./webpack.config')

/** @type {import('webpack').Configuration[]} */
const configs = devConfigs.map((c) => {
  return {
    ...c,
    mode: 'production',
    watch: false,
  }
})

module.exports = configs
