/**
 * 通報
 */
const Sequelize = require('sequelize')
const Model = require('./model')

const Report = Model('report', {
  /* Actor key + 通報 ID */
  report_full_id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  /* SUGO-Actor key */
  actor_key: {
    type: Sequelize.STRING,
    allowNull: false
  },
  /* 通報 ID */
  report_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  /* オープンかクローズか */
  is_open: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  /* 最初の通報があった日時 */
  report_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  /* 通報がクローズされた日時 */
  closed_at: {
    type: Sequelize.DATE,
    allowNull: true
  }
})

module.exports = Report
