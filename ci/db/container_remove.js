#!/usr/bin/env node
/**
 * Remove MySQL Docker container
 */

const { mysql } = require('ci-docker-commands')

function remove () {
  process.chdir(__dirname + '/../..')

  mysql.removeMysql()
}

module.exports = remove

if (!module.parent) {
  remove()
}
