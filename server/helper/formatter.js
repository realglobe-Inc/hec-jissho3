/**
 * データ変換
 * UIでも使うので ES5 で書いた。
 */
var camelcase = require('lodash.camelcase')
var snakecase = require('snake-case')

var camel = _translateCase('camel')
var snake = _translateCase('snake')

var formatter = {
  /**
   * 通報詳細情報を生 -> DB用に変換する
   */
  infoRawToDb ({report, actorKey, event}) {
    var [lat, lng] = report.location
    var {id: reportId, heartRate, date} = report
    var reportFullId = this.toReportFullId({actorKey, reportId})
    var data = snake({
      reportFullId,
      lat,
      lng,
      date,
      event,
      info: { heartRate }
    })
    return data
  },
  /**
   * 通報詳細情報をDB -> UI用に変換する
   */
  infoDbToUI (reportInfo) {
    return {
      reportFullId: reportInfo.report_full_id,
      location: {
        lat: reportInfo.lat,
        lng: reportInfo.lng
      },
      date: new Date(reportInfo.date),
      event: reportInfo.event,
      info: reportInfo.info
    }
  },

  /**
  * データベース関係。 actorKey, reportId, reportFullId の三者変換
  */
  toReportFullId ({actorKey, reportId}) {
    return `${actorKey}#${reportId}`
  },
  toActorKey (reportFullId) {
    return reportFullId.split('#')[0]
  },
  toReportId (reportFullId) {
    return parseInt(reportFullId.split('#')[1], 10)
  }
}

/**
 * オブジェクトのキーを camelcase(or snakecase) に変換する
 */
function _translateCase (type) {
  return (obj) => {
    var translate = {
      snake: snakecase,
      camel: camelcase
    }[type]
    var res = {}
    var keys = Object.keys(obj)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      res[translate(key)] = obj[key]
    }
    return res
  }
}

function _isDateKey (key) {
  return key === 'date' || key === 'createdAt' || key === 'updatedAt'
}

module.exports = formatter
