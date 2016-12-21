#!/usr/bin/env node
const { port } = require('@self/server/env')
const shareServer = require('@self/server/lib/share_server')
const co = require('co')

co(function * () {
  yield shareServer.listen(port.SHARE)
  console.log(`SHARE server listening on port ${port.SHARE}`)
})
