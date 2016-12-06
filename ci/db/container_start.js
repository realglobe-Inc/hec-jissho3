#!/usr/bin/env node
/**
 * Start MySQL Docker container
 */

const { mysql } = require('ci-docker-commands')

function start () {
  process.chdir(__dirname + '/../..')

  mysql.startMysql()
}

module.exports = start

if (!module.parent) {
  start()
}
