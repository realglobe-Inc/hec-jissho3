/**
 * 通報情報
 */
const Sequelize = require('sequelize')
const Model = require('./model')

const ReportInfo = Model('report_info', {
  report_full_id: {
    type: Sequelize.STRING
  },
  /* 緯度 */
  lat: {
    type: Sequelize.DOUBLE(9, 6)
  },
  /* 経度 */
  lng: {
    type: Sequelize.DOUBLE(9, 6)
  },
  /* イベント名 warning | emergency */
  event: {
    type: Sequelize.STRING
  },
  /* 送られてきた時間 */
  date: {
    type: Sequelize.DATE
  },
  /* 付加情報 */
  info: {
    type: Sequelize.STRING
  }
})

module.exports = ReportInfo
