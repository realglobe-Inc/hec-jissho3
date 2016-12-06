import * as sugoCaller from 'sugo-caller'
import urls from './urls'
import { Caller } from '../interfaces/app'
import * as CONSTS from '@self/server/lib/consts'

const debug = require('debug')('hec:tablet_caller_manager')
const { SUGOS } = CONSTS
const {
  DATA_SYNC_ACTOR
} = SUGOS

/**
 * UI server 用の actor に接続する
 * タブレットで見る画面用なので store を使わない
 */
export function connectDataSyncCaller (cb: Function) {
  let key: string = DATA_SYNC_ACTOR.KEY
  return sugoCaller(urls.uiCallers())
          .connect(key)
          .then((caller: Caller) => {
            debug(`Connected caller: ${key}`)
            initializeDataSyncer(key, caller, cb)
          })
}

/**
 * Data Syncer の初期化
 */
function initializeDataSyncer (key: string, caller: Caller, cb: Function) {
  let syncer = caller.get(DATA_SYNC_ACTOR.MODULE)
  syncer.fetch()
    .then((data) => {
      cb(data.sharedPhoto)
    })
  syncer.on(DATA_SYNC_ACTOR.UPDATE_EVENT, ({ key, nextValue }) => {
    if (key === 'sharedPhoto') {
      debug(nextValue)
      cb(nextValue)
    }
  })
}