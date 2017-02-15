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
  let cwd = join(__dirname, '..')
  // Only heroku
  // This is a very bad practice!!!
  yield execAsync(`cp -r server node_modules/@self/`, { cwd })
  yield execAsync(`cp -r ui node_modules/@self/`, { cwd })

  // externals
  yield execAsync('./ci/externals.sh')
}).catch(err => console.error(err))
