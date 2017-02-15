#!/usr/bin/env node
/**
 * Sync Datebase
 */
process.env.DEBUG = 'hec:db'
const db = require('../../server/db')

db.sync()
