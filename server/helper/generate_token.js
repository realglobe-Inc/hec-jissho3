/**
 * Generate token
 * @function generateToken
 */
'use strict'

const uuid = require('uuid')

/** @lends generateToken */
function generateToken () {
  return uuid.v4().replace(/-g/, '')
}

module.exports = generateToken

if (!module.parent) {
  console.log(generateToken())
}