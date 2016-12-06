#!/usr/bin/env node
/**
 * Push docker image.
 */

const { execSync } = require('child_process')
const pkg = require('../../package.json')

process.chdir(__dirname + '/../..')

execSync(`docker push realglobe-docker-virtual.jfrog.io/${pkg.name}:latest .`, {
  stdio: 'inherit',
  cwd: __dirname + '/../../server'
})
