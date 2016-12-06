/**
 * 共有された画像を AR-Compass server にポストする
 */

const sugoCaller = require('sugo-caller')
const { SUGOS, SUGOS_URL } = require('../consts')
const { port } = require('@self/env')
const debug = require('debug')('hec:postArCompassCaller')
const co = require('co')
const { DATA_SYNC_ACTOR } = SUGOS

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
        // AR Compass server にポストする
      }
    })
  })
}

module.exports = watchSharedPhoto
