const Koa = require('koa')
const proxy = require('koa-proxy')
const promisify = require('es6-promisify')
const { join } = require('path')
const { port } = require('@self/server/env')
const {
  UI,
  CAMERA,
  REPORT,
  SHARE,
  HEROKU,
} = port

let proxyServer = new Koa()

let rewrite = path => path.replace(/^\/jissho3/, '')

proxyServer.use(proxy({
  host: `http://localhost:${CAMERA}`,
  match: /^\/jissho3\/rest\/cameras\//,
  map: rewrite
}))

proxyServer.use(proxy({
  host: `http://localhost:${REPORT}`,
  match: /^\/jissho3\/rest\/reports\//,
  map: rewrite
}))

proxyServer.use(proxy({
  host: `http://localhost:${SHARE}`,
  match: /^\/jissho3\/rest\/share\//,
  map: rewrite
}))

proxyServer.use(proxy({
  host: `http://localhost:${REPORT}`,
  match: /^\/jissho3\/sugos\/report\//,
  map: rewrite
}))

proxyServer.use(proxy({
  host: `http://localhost:${UI}`,
  match: /^\/jissho3\/sugos\/ui\//,
  map: rewrite
}))

proxyServer.use(proxy({
  host: `http://localhost:${UI}`,
  match: /^\/jissho3\//,
  map: rewrite
}))

// promisify listen
let listen = proxyServer.listen.bind(proxyServer)
proxyServer.listen = promisify(listen)

if (!module.parent) {
  proxyServer.listen(HEROKU)
}


module.exports = proxyServer