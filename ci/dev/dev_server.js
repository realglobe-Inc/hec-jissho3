#!/usr/bin/env node
/**
 * Dev server of webpack
 */

const DevServer = require('webpack-dev-server')
const webpack = require('webpack')
const config = require('../../webpack.config.dev')
const promisify = require('es6-promisify')
const { port } = require('@self/server/env')

const compiler = webpack(config)
const HOST = 'localhost'

let devServer = new DevServer(compiler, {
  contentBase: `http://${HOST}/`,
  hot: true,
  historyApiFallback: false,
  compress: false,
  proxy: {
    '*': `http://${HOST}:${80}` // Nginx がプロキシサーバとして動いているはずである
  },
  staticOptions: {},

  // webpack-dev-middleware options
  quiet: false,
  noInfo: true,
  publicPath: '/jissho3/',
  stats: { colors: true }
})

// promisify listen
let listen = devServer.listen.bind(devServer)
devServer.listen = promisify(listen)

if (!module.parent) {
  devServer.listen(port.DEV)
}

module.exports = devServer
