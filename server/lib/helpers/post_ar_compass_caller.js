/**
 * 共有された画像や位置情報を AR-Compass server にポストする
 * dataSyncActor に対する Caller で、イベントを監視する。
 */

const sugoCaller = require('sugo-caller')
const { SUGOS, SUGOS_URL } = require('../consts')
const { port } = require('@self/server/env')
const fs = require('fs')
const debug = require('debug')('hec:postArCompassCaller')
const co = require('co')
const easyimg = require('easyimage') // Dependent on imagemagick
const { join } = require('path')
const { DATA_SYNC_ACTOR } = SUGOS
const request = require('request')

const AR_COMPASS_URL = `http://localhost:${port.AR_COMPASS}`
const PROJECT_DIR = join(__dirname, '../..')
const OUTPUT_DIR = join(PROJECT_DIR, 'tmp')
const RESIZE_WIDTH = 200

function watchSharedPhoto () {
  return co(function * () {
    let caller = sugoCaller({
      protocol: 'http',
      hostname: 'localhost',
      port: port.UI,
      path: SUGOS_URL.UI_PATH
    })
    let actor = yield caller.connect(DATA_SYNC_ACTOR.KEY)
    let syncer = actor.get(DATA_SYNC_ACTOR.MODULE)
    syncer.on(DATA_SYNC_ACTOR.UPDATE_EVENT, ({key, nextValue}) => {
      switch (key) {
        case 'sharedPhoto':
          resizeAndPost(nextValue)
          return
        case 'sharedReport':
          postLocation(nextValue)
        default:
          return
      }
    })
    return caller
  })
}

function resizeAndPost (photoInfo) {
  return co(function * () {
    let photoPath = join(PROJECT_DIR, 'public', photoInfo.image)
    let resizedPath = join(OUTPUT_DIR, photoInfo.image)
    yield easyimg.resize({
      src: photoPath,
      dst: resizedPath,
      width: RESIZE_WIDTH,
    })
    yield new Promise((resolve, reject) => {
      request.post({
        url: AR_COMPASS_URL + '/ar-compass/image',
        formData: {
          img: fs.createReadStream(resizedPath)
        }
      }, (err) => {
        err ? reject(err) : resolve()
      })
    })
    debug('Posted image', photoInfo.image)
  }).catch((err) => console.error(err))
}

function postLocation (report) {
  return new Promise((resolve, reject) => {
    let { location } = report.latestInfo
    if (!location) {
      reject(new Error(`Invalid report ${report}`))
    }
    request.post({
      url: AR_COMPASS_URL + '/ar-compass/location',
      json: true,
      body: location
    }, (err, res, body) => {
      debug('Posted', location)
      err ? reject(err) : resolve(body)
    })
  }).catch((err) => console.error(err))
}

module.exports = watchSharedPhoto
