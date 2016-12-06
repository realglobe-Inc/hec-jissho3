#!/usr/bin/env node
/**
 * Drop all tables
 */
process.env.DEBUG = 'hec:db'
const db = require('db')

db.drop()
