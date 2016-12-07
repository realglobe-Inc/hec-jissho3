/**
 * 共有された画像を AR-Compass server にポストする
 * dataSyncActor に対する Caller で、イベントを監視して画像共有イベントのときにポストする。
 */

const sugoCaller = require('sugo-caller')
const { SUGOS, SUGOS_URL } = require('../consts')
const { port } = require('@self/env')
const debug = require('debug')('hec:postArCompassCaller')
const co = require('co')
const easyimg = require('easyimage') // Dependent on imagemagick
const { join } = require('path')
const { DATA_SYNC_ACTOR } = SUGOS
const request = require('request')

const AR_COMPASS_URL = `http://localhost:${port.AR_COMPASS}`
const PUBLIC_DIR = join(__dirname, '../..')
const OUTPUT_DIR = join(PUBLIC_DIR, 'tmp')
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
      if (key === 'sharedPhoto') {
        resizeAndPost(nextValue)
      }
    })
    return caller
  })
}

function resizeAndPost (photoInfo) {
  return co(function * () {
    let photoPath = join(PUBLIC_DIR, photoInfo.image)
    let resizedPath = join(OUTPUT_DIR, photoInfo.image)
    yield easyimg.resize({
      src: photoPath,
      dst: resizedPath,
      width: RESIZE_WIDTH,
    })
    yield new Promise((resolve, reject) => {
      request.post({
        url: AR_COMPASS_URL,
        formData: {
          img: fs.createReadStream(resizedPath)
        }
      }, (err) => {
        err ? reject(err) : resolve()
      })
    })
    debug(`Posted ${photoInfo.image}`)
  }).catch((err) => console.error(err))
}

module.exports = watchSharedPhoto
