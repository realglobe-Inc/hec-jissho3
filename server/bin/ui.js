#!/usr/bin/env node
const co = require('co')
const { port } = require('../env')
const uiServer = require('../lib/ui_server')

co(function * () {
  yield uiServer.listen(port.UI)
  console.log(`UI server listening on port ${port.UI}`)
  yield uiServer.actor.connect()
  yield uiServer.watchSharedPhoto()
}).catch(err => console.error(err))

