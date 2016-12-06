import assert from 'assert'
import Store from '../interfaces/store'
import { Marker, Report, Location, PhotoInfo } from '../interfaces/app'
import appUtil from './app_util'
import actions from '../actions'
import urls from './urls'
import * as bRequest from 'browser-request'
import { connectReportCaller, connectCameraCaller, connectDataSyncCaller } from './caller_manager'
import * as formatter from '@self/server/helper/formatter'
import * as config from '@self/ui/config'

const { mapCenter } = config
const debug = require('debug')('hec:store_util')

/**
 * 選択されているマーカーを取得
 */
export function getSelectedMarker (state: Store.State): Marker | null {
  let { markers, selectedMarker } = state
  let { id } = selectedMarker
  let marker = markers.get(id)
  return marker || null
}

/**
 * 新しいマーカーIDを発行する
 */
export const newMarkerId = (() => {
  let id = 1
  return (): number => {
    id += 1
    return id
  }
})()

/**
 * Storeの初期化処理
 */
export function initialize (store: Redux.Store<any>) {
  // Callers
  connectCameraCaller()
  connectReportCaller()
  connectDataSyncCaller()

  // 自分の位置
  if (navigator.geolocation) {
    appUtil.getMyLocation()
      .then((location: Location) => {
        let myMarker: Marker = {
          id: newMarkerId(),
          type: 'person',
          name: 'You',
          location: location,
          keys: {}
        }
        store.dispatch(actions.markers.addMarker(myMarker))
        return myMarker.id
      }).then((id: number) => {
        // 一定時間ごとに更新
        setInterval(() => {
          appUtil.getMyLocation()
          .then((location: Location) => {
            store.dispatch(actions.markers.updateMarker({
              id,
              location
            }))
          })
        }, 5000)
      }).catch((err) => {
        console.error('閲覧者の位置情報を取得できませんでした')
      })
  } else {
    debug('Not found navigator.geolocation')
  }

  // 最新の通報
  bRequest({
    url: urls.openReports(),
    method: 'GET',
    json: true
  }, (err, res, body) => {
    if (err) {
      window.alert('最新の通報情報を取得できませんでした。')
      console.error(err)
      return
    }
    let reports: Report[] = body.map((dbReport) => {
      let reportFullId: string = dbReport.report_full_id
      let reportId: number = formatter.toReportId(reportFullId)
      let actorKey: string = formatter.toActorKey(reportFullId)

      let report: Report = {
        reportFullId,
        reportId,
        actorKey,
        isOpen: true,
        reportAt: new Date(dbReport.report_at),
        latestInfo: {
          reportFullId,
          location: {
            lat: dbReport.latestInfo.lat,
            lng: dbReport.latestInfo.lng
          },
          event: dbReport.latestInfo.event,
          date: dbReport.latestInfo.date,
          info: dbReport.latestInfo.info
        }
      }
      return report
    })
    store.dispatch(actions.reports.setReports(reports))

    // 通報を地図に反映
    let markers: Marker[] = reports.map((report) => {
      let marker: Marker = {
        id: newMarkerId(),
        type: 'report',
        name: `通報@${appUtil.formatTime(report.reportAt)}`,
        location: report.latestInfo.location,
        keys: {
          reportFullId: report.reportFullId
        }
      }
      return marker
    })
    store.dispatch(actions.markers.addMarkers(markers))
  })

  // 画像の情報
  appUtil.fetchPhotoList()
    .then((photoArray: PhotoInfo[]) => {
      store.dispatch(actions.photos.setPhotos(photoArray))
    })
}

export default {
  getSelectedMarker,
  newMarkerId,
  initialize
}