/**
 * Server to share a photo
 */

const sgServer = require('sg-server')
const koaBody = require('koa-body')({
  multipart: true
})
const endpoints = require('./endpoints/share')

let shareServer = sgServer({
  endpoints,
  middlewares: [ koaBody ]
})

module.exports = shareServer
