#!/usr/bin/env node
const { port } = require('@self/server/env')
const cameraServer = require('@self/server/lib/camera_server')
const co = require('co')

co(function * () {
  yield cameraServer.listen(port.CAMERA)
  console.log(`CAMERA server listening on port ${port.CAMERA}`)

  let monitorActor = cameraServer.photoMonitorActor()
  yield monitorActor.connect()
})
