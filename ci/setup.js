#!/usr/bin/env node

const co = require('co')
const { exec } = require('child_process')
const { readdir } = require('fs')
const mkdirp = require('mkdirp')
const promisify = require('es6-promisify')
const { join } = require('path')

const mkdirpAsync = promisify(mkdirp)
const execAsync = promisify(exec)
const readdirAsync = promisify(readdir)

process.chdir(__dirname + '/..')

co(function * () {
  // Make tmp
  yield mkdirpAsync('tmp')

  // Make simbolic link of this project at node_modules/@self
  let selfPath = 'node_modules/@self'
  yield mkdirpAsync(selfPath)
  let dirs = [
    'server',
    'ui'
  ]
  let cwd = join(__dirname, '..')
  for (let dir of dirs) {
    // Only heroku
    yield execAsync(`rm node_modules/@self/* || true`, { cwd })
    yield execAsync(`ln -s ../../${dir} ${selfPath}/`, { cwd })
  }

  // externals
  yield execAsync('./ci/externals.sh')
}).catch(err => console.error(err))
