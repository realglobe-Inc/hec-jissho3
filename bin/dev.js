#!/usr/bin/env node

process.env.NODE_ENV = 'development'
process.env.DEBUG = 'sg:*,hec:*'

const { port } = require('@self/server/env')
const dev = require('../ci/dev/dev_server')
const co = require('co')
const debug = require('debug')('hec:dev')
const app = require('./app')

co(function * () {
  // app
  yield app()

  // Dev
  yield dev.listen(port.DEV)
  debug(`Dev server listening on port ${port.DEV}`)
}).catch(err => console.error(err))
