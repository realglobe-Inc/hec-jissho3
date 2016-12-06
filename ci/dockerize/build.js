#!/usr/bin/env node
/**
 * Build docker image.
 */

const { execSync } = require('child_process')
const pkg = require('../../package.json')

execSync('npm run compile', {
  stdio: 'inherit',
  cwd: __dirname + '/../..'
})
execSync(`docker build --force-rm=true --no-cache=true -t realglobe-docker-virtual.jfrog.io/${pkg.name}:latest .`, {
  stdio: 'inherit',
  cwd: __dirname + '/../../server'
})
