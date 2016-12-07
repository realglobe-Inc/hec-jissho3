import * as sugoCaller from 'sugo-caller'
import urls from './urls'
import store from './store'
import actions from '../actions'
import appUtil from './app_util'
import { Caller, Report, ReportInfo, Marker, PhotoInfo, Location } from '../interfaces/app'
import { newMarkerId } from './store_util'
import { Store } from '../interfaces/store'
import * as CONSTS from '@self/server/lib/consts'

const debug = require('debug')('hec:caller_manager')
const { SUGOS } = CONSTS
const {
  REPORTER_MODULE,
  MASTER_ACTOR,
  PHOTO_MONITOR_ACTOR,
  DATA_SYNC_ACTOR
} = SUGOS

function connectCaller (key: string, initialize: Function) {
  return sugoCaller(urls.uiCallers())
          .connect(key)
          .then((caller: Caller) => {
            debug(`Connected caller: ${key}`)
            initialize(key, caller)
            store.dispatch(actions.callers.addCaller({
              key, caller
            }))
          })
}

/**
 * Camera server 用の actor に接続する
 */
export function connectCameraCaller () {
  return connectCaller(PHOTO_MONITOR_ACTOR.KEY, initializeCameraMonitor)
}

/**
 * Report server 用の actor に接続する
 */
export function connectReportCaller () {
  return connectCaller(MASTER_ACTOR.KEY, initializeReporter)
}

/**
 * UI server 用の actor に接続する
 */
export function connectDataSyncCaller () {
  return connectCaller(DATA_SYNC_ACTOR.KEY, initializeDataSyncer)
}

/**
 * 通報callerの初期化
 */
function initializeReporter (key: string, caller: Caller) {
  let reporter = caller.get(MASTER_ACTOR.MODULE)
  reporter.on(MASTER_ACTOR.NEW_REPORT_EVENT, (report: Report) => {
    debug('New report: ', report)
    report.reportAt = new Date(report.reportAt) // Date 型だけ注意
    let marker: Marker = {
      id: newMarkerId(),
      type: 'report',
      name: `通報@${appUtil.formatTime(report.reportAt)}`,
      location: report.latestInfo.location,
      keys: {
        reportFullId: report.reportFullId
      }
    }
    // 警報音
    let audio = document.createElement('audio')
    audio.src = 'warning.mp3'
    audio.autoplay = true
    // 関係各所にdispatch
    store.dispatch(actions.reports.addReport(report))
    store.dispatch(actions.markers.addMarker(marker))
    store.dispatch(actions.selectedMarker.selectMarker(marker.id))
    store.dispatch(actions.modalWindow.openOkWarningModal())
  })
  reporter.on(MASTER_ACTOR.REPORT_INFO_EVENT, (info: ReportInfo) => {
    info.date = new Date(info.date) // Date 型だけ注意
    let state: Store.State = store.getState()
    let report: Report = state.reports.get(info.reportFullId, null)
    if (!report) {
      return
    }
    store.dispatch(actions.reports.UpdateReportInfo(info))
  })
}

/**
 * カメラサーバー監視callerの初期化
 */
function initializeCameraMonitor (key: string, caller: Caller) {
  let monitor = caller.get(PHOTO_MONITOR_ACTOR.MODULE)
  monitor.on(PHOTO_MONITOR_ACTOR.CREATED_EVENT, (photo: PhotoInfo) => {
    debug(`Added photo ${photo.uuid}`)
    store.dispatch(actions.photos.addPhoto(photo))
  })
  monitor.on(PHOTO_MONITOR_ACTOR.REMOVED_EVENT, (data) => {
    debug(data)
  })
}

/**
 * Data Syncer の初期化
 */
function initializeDataSyncer (key: string, caller: Caller) {
  let syncer = caller.get(DATA_SYNC_ACTOR.MODULE)
  syncer.fetch()
    .then((data) => {
      // 本部の位置
      debug(`Sync ${JSON.stringify(data)}`)
      let { centerLocation } = data
      let marker: Marker = {
          id: newMarkerId(),
          type: 'center',
          name: '本部',
          location: centerLocation,
          keys: {}
      }
      store.dispatch(actions.markers.addMarker(marker))
      store.dispatch(actions.map.changeMapCenter(centerLocation))
  })
  syncer.on(DATA_SYNC_ACTOR.UPDATE_EVENT, ({ key, nextValue }) => {
    // すでにある state と異なっているなら store を更新する
    // key 文字列をここに書くのはダサい
    switch (key) {
      case 'centerLocation':
        {
          let {map, markers} = store.getState()
          let centerLocation: Location = nextValue
          let shouldSkip = centerLocation.lat === map.center.lat && centerLocation.lng === map.center.lng
          if (shouldSkip) {
            return
          }
          let centerMarker: Marker = markers.find((marker) => marker.type === 'center')
          store.dispatch(actions.markers.updateMarker({
            id: centerMarker.id,
            location: nextValue
          }))
        }
        return
      case 'reportClosed':
        {
          let { reportClosed } = store.getState()
          let report: Report = nextValue.report
          let shouldSkip = reportClosed.closed && report.reportFullId === reportClosed.report.reportFullId
          if (shouldSkip) {
            return
          }
          store.dispatch(actions.reportClosed.setClosedReport(report))
          return
        }
      case 'sharedReport':
        {
          let report: Report = nextValue
          store.dispatch(actions.reportShared.setSharedReport(report))
          return
        }
      case 'sharedPhoto':
        return
      default:
        return
    }
  })
}