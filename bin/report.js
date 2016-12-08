#!/usr/bin/env node
const co = require('co')
const { port } = require('@self/server/env')
const reportServer = require('@self/server/lib/report_server')

co(function * () {
  yield reportServer.listen(port.REPORT)
  console.log(`REPORT server listening on port ${port.REPORT}`)

  let observer = reportServer.createObserver()
  yield observer.start()
}).catch((err) => console.error(err))
