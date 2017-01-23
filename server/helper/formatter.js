'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * データ変換
 * UIでも使うので ES5 で書いた。
 */
var camelcase = require('lodash.camelcase');
var snakecase = require('snake-case');

var camel = _translateCase('camel');
var snake = _translateCase('snake');

var formatter = {
  /**
   * 通報詳細情報を生 -> DB用に変換する
   */
  infoRawToDb: function infoRawToDb(_ref) {
    var report = _ref.report,
        actorKey = _ref.actorKey,
        event = _ref.event;

    var _report$location = _slicedToArray(report.location, 2),
        lat = _report$location[0],
        lng = _report$location[1];

    var reportId = report.id,
        heartRate = report.heartRate,
        date = report.date;

    var reportFullId = this.toReportFullId({ actorKey: actorKey, reportId: reportId });
    var data = snake({
      reportFullId: reportFullId,
      lat: lat,
      lng: lng,
      date: date,
      event: event,
      info: { heartRate: heartRate }
    });
    return data;
  },

  /**
   * 通報詳細情報をDB -> UI用に変換する
   */
  infoDbToUI: function infoDbToUI(reportInfo) {
    return {
      reportFullId: reportInfo.report_full_id,
      location: {
        lat: reportInfo.lat,
        lng: reportInfo.lng
      },
      date: new Date(reportInfo.date),
      event: reportInfo.event,
      info: reportInfo.info
    };
  },


  /**
  * データベース関係。 actorKey, reportId, reportFullId の三者変換
  */
  toReportFullId: function toReportFullId(_ref2) {
    var actorKey = _ref2.actorKey,
        reportId = _ref2.reportId;

    return actorKey + '#' + reportId;
  },
  toActorKey: function toActorKey(reportFullId) {
    return reportFullId.split('#')[0];
  },
  toReportId: function toReportId(reportFullId) {
    return parseInt(reportFullId.split('#')[1], 10);
  }
};

/**
 * オブジェクトのキーを camelcase(or snakecase) に変換する
 */
function _translateCase(type) {
  return function (obj) {
    var translate = {
      snake: snakecase,
      camel: camelcase
    }[type];
    var res = {};
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      res[translate(key)] = obj[key];
    }
    return res;
  };
}

function _isDateKey(key) {
  return key === 'date' || key === 'createdAt' || key === 'updatedAt';
}

module.exports = formatter;

