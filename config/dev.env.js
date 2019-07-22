'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseURL: '"http://localhost:8090"',
  wsURL: '"ws://localhost:8090"',
  ossURL: '"https://mhomestead.oss-cn-shanghai.aliyuncs.com/"'
})
