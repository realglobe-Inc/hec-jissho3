#!/usr/bin/env node

const { port } = require('@self/server/env')
const proxy = require('../ci/dev/proxy_server')
const co = require('co')
const debug = require('debug')('hec:dev')
const app = require('./app')

co(function * () {
  // app
  yield app()

  // Proxy
  yield proxy.listen(port.HEROKU)
  debug(`Dev server listening on port ${port.HEROKU}`)
}).catch(err => console.error(err))
