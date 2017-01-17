#!/usr/bin/env node

process.env.DEBUG = 'sg:*,hec:*'

const { port } = require('@self/server/env')

const PROTOCOL = process.env.PROTOCOL || 'http'
const HOST = process.env.HOST || `localhost:${port.DEV}`

// README の Actor 規約参照
const ACTOR_KEY = process.env.ACTOR_KEY || `qq:reporter:${randInt()}`

const co = require('co')
const asleep = require('asleep')
const sugoActor = require('sugo-actor')
const { Module } = sugoActor
const debug = require('debug')('hec:reporter')

let actor

// 終了時に disconnect する
// Observer に切断を知らせるため
process.on('SIGINT', () => co(function * () {
  setTimeout(() => {
    process.exit()
  }, 1000)
  try {
    yield actor.disconnect()
  } catch (e) {
    console.error(e)
  }
}))

co(function * () {
  let reporter = new Module({})
  actor = sugoActor({
    protocol: PROTOCOL,
    host: HOST,
    key: ACTOR_KEY,
    path: '/jissho3/sugos/report/socket.io',
    modules: { reporter }
  })
  yield actor.connect()

  // 通報する Mock
  let id = Math.floor(Math.random() * 1000000)
  debug('Hitoe actor key:', ACTOR_KEY)
  debug('Hitoe report id: ', id)
  let [lat, lng, h] = randLocation()
  let reports = (new Array(1000)).fill(1).map((v, i) => ({
    id,
    location: [lat, lng + i * 0.0001, h],
    heartRate: randHeart()
  }))
  for (let report of reports) {
    yield asleep(2000)
    report.date = (new Date()).toISOString()
    reporter.emit('emergency', report)
  }
}).catch((err) => console.error(err))

// --- Private function ---

function randInt () {
  return Math.floor(Math.random() * 1000000)
}

function randHeart () {
  return Math.floor(Math.random() * 10)
}

function randLocation () {
  let lat = 35.700275 + Math.random() * 0.005
  let lng = 139.753314 + Math.random() * 0.005
  return [lat, lng, 10.22]
}
