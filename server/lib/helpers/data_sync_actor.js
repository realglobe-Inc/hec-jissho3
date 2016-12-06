const sugoActor = require('sugo-actor')
const { Module } = sugoActor
const co = require('co')
const { SUGOS, SUGOS_URL } = require('../consts')
const { port } = require('@self/env')
const debug = require('debug')('hec:dataSyncActor')

const { DATA_SYNC_ACTOR } = SUGOS

let state = {
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
  }
}

function createDataSyncActor () {
  let dataObj = Object.assign({}, state)
  let syncer = new Module({
    fetch () {
      return co(function * () {
        return dataObj
      })
    },
    update ({key, nextValue}) {
      const s = this
      return co(function * () {
        dataObj[key] = nextValue
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