const sugoObserver = require('sugo-observer')
const sugoCaller = require('sugo-caller')
const co = require('co')
const debug = require('debug')('hec:report-observer')
const formatter = require('@self/server/helper/formatter')
const models = require('@self/server/db/models')
const { Report, ReportInfo } = models
const sugoActor = require('sugo-actor')
const { Module } = sugoActor

const { SUGOS } = require('../consts')
const {
  REPORTER_MODULE,
  MASTER_ACTOR
} = SUGOS
const { ReportServer } = require('../config')

/**
 * sugo-hub を監視して、 通報用 actor の接続を検出する。
 */
class ReportObserver {
  /**
   * options should have url information
   */
  constructor () {
    const s = this
    s.observer = sugoObserver(s._handler.bind(s), ReportServer.observerConfig)
    s.callers = {}

    // masterReporter が emit する
    s.masterReporter = new Module({})
    s.masterActor = sugoActor(Object.assign({
      key: MASTER_ACTOR.KEY,
      modules: {
        [MASTER_ACTOR.MODULE]: s.masterReporter
      }
    }, ReportServer.masterActorConifg))
  }

  /**
   * 監視を開始する
   */
  start (options) {
    const s = this
    return co(function * () {
      yield s.observer.start()
      yield s.masterActor.connect()
    })
  }

  /**
   * 監視を終了する
   */
  stop () {
    const s = this
    return co(function * () {
      yield s.observer.stop()
      yield s.masterActor.disconnect()
      for (let key of Object.keys(s.callers)) {
        let caller = s.callers[key]
        try {
          yield caller.disconnect(key)
        } catch (e) {
          console.error(e)
        }
      }
    })
  }

  /**
   * observer に渡す関数
   */
  _handler ({data, event}) {
    const s = this
    return co(function * () {
      let actorKey = data.key
      // report actor のイベントでなければ無視する
      let isReport = event.startsWith('actor') && actorKey.startsWith('qq:reporter:')
      if (!isReport) {
        return
      }

      // 接続時
      if (event === 'actor:update' && data.spec.reporter) {
        // caller
        debug('Trying to connect caller: ', actorKey)
        let caller = sugoCaller(ReportServer.callerConfig)
        let actor = yield caller.connect(actorKey)
        let reporter = actor.get(REPORTER_MODULE)
        if (!reporter) {
          throw new Error('Cannot get an hitoe module.')
        }
        s.callers[actorKey] = caller
        // Add event listener
        // hitoe.on('warning', s._pushReportDb(actorKey)('warning'))
        reporter.on('emergency', s._pushReportDb({actorKey, event}).bind(s))
        reporter.on('error', (err) => { console.error(err) })
      }

      // 切断時
      // TODO ソケット切断後にタイムアウト切断
      if (event === 'actor:teardown') {
        let caller = s.callers[actorKey]
        if (!caller) {
          return
        }
        delete s.callers[actorKey]
        try {
          yield caller.disconnect(actorKey)
        } catch (e) {
          // エラーが出ても接続はちゃんと切れる
          console.error(e)
        }
      }
    }).catch((err) => console.error(err))
  }

  /**
   * 通報データをDBにつっこむ
   * はじめて通報が来たら Report にもつっこむ。
   * Report が open である限り毎回 ReportInfo につっこむ。
   */
  _pushReportDb ({actorKey, event}) {
    const s = this
    return (report) => co(function * () {
      let infoData = formatter.infoRawToDb({report, actorKey, event})
      debug('Observer recieve report', infoData)

      let { report_full_id } = infoData
      let found = yield Report.findOne({
        where: { report_full_id }
      })
      if (!found) {
        let actor_key = formatter.toActorKey(report_full_id)
        let report_id = formatter.toReportId(report_full_id)
        s.masterReporter.emit(MASTER_ACTOR.NEW_REPORT_EVENT, {
          // formatter 使うべき
          reportFullId: report_full_id,
          reportId: report_id,
          actorKey: actorKey,
          reportAt: infoData.date,
          isOpen: true,
          latestInfo: formatter.infoDbToUI(infoData)
        })
        yield Report.create({
          report_full_id,
          actor_key,
          report_id,
          is_open: true,
          report_at: infoData.date
        })

      }

      // open でない通報は無視する
      let isOpen = !!found && found.is_open
      if (!isOpen) {
        return
      }

      yield ReportInfo.create(infoData)
      s.masterReporter.emit(MASTER_ACTOR.REPORT_INFO_EVENT, formatter.infoDbToUI(infoData))
    }).catch((err) => console.error(err))
  }
}

module.exports = ReportObserver
