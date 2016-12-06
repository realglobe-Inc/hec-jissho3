#!/usr/bin/env node
/**
 * Run MySQL Docker container
 */
'use strict'

process.chdir(__dirname + '/../..')

const { mysql } = require('ci-docker-commands')

function run () {
  const { DATABASE, ROOT_PASSWORD, PORT } = require('../../server/env').database

  let { ip, port } = mysql.runMysql({
    database: DATABASE,
    rootPassword: ROOT_PASSWORD,
    port: PORT
  })

  console.log(`Your database is ready! ${JSON.stringify({ ip, port })}`)
}

module.exports = run

if (!module.parent) {
  run()
}
