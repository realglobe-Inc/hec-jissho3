#!/usr/bin/env node
const { port } = require('../env')
const uiServer = require('../lib/ui_server')

uiServer
  .listen(port.UI)
  .then(() => {
    console.log(`UI server listening on port ${port.UI}`)
    uiServer.actor.connect()
  })
