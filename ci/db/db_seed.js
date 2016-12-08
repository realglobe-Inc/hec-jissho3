#!/usr/bin/env node
/**
 * Seed Datebase
 */
process.env.DEBUG = 'hec:db'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const co = require('co')
const db = require('@self/server/db')

co(function * () {
  yield db.drop()
  yield db.sync()
  yield db.seed()
})
