#!/usr/bin/env node
/**
 * Stop MySQL Docker container
 */

const { mysql } = require('ci-docker-commands')

function stop () {
  process.chdir(__dirname + '/../..')

  mysql.stopMysql()
}

module.exports = stop

if (!module.parent) {
  stop()
}
