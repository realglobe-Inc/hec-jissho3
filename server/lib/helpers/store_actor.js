/**
 * UI の Store 機能を一部遠隔化
 */

const sugoActor = require('sugo-actor')
const { Module } = sugoActor
const co = require('co')
const { SUGOS, SUGOS_URL } = require('../consts')
const { port } = require('@self/server/env')
const debug = require('debug')('hec:store_actor')

const { STORE_ACTOR } = SUGOS

let initialState = {
  centerLocation: {
    lat: 35.701562,
    lng: 139.753148
  },
  sharedPhoto: {
    isSelected: false,
    info: null,
    image: '',
    createdAt: '',
    uuid: ''
  },
  reportClosed: {
    report: {}
  },
  sharedReport: {
    latestInfo: {
      location: {
        lat: 35.701562,
        lng: 139.753148
      }
    }
  }
}

function createDataSyncActor () {
  let syncer = new Module({
    fetch () {
      return co(function * () {
        return state
      })
    },
    update ({key, nextValue}) {
      const s = this
      return co(function * () {
        state[key] = nextValue
        debug(key, nextValue)
        s.emit(DATA_SYNC_ACTOR.UPDATE_EVENT, { key, nextValue })
      })
    }
  })
  let actor = sugoActor({
    key: DATA_SYNC_ACTOR.KEY,
    modules: { [DATA_SYNC_ACTOR.MODULE]: syncer },
    protocol: 'http',
    hostname: 'localhost',
    port: port.UI,
    path: SUGOS_URL.UI_PATH
  })
  return actor
}

module.exports = createDataSyncActor