/**
 * Server to share a photo
 */

const sgServer = require('sg-server')
const endpoints = require('./endpoints/share')

let shareServer = sgServer({ endpoints })

module.exports = shareServer
