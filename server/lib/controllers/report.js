/**
 * Controllers for report
 * @module reportController
 */

const co = require('co')
const models = require('@self/server/db/models')
const compose = require('sg-server/lib/compose')
const schemaMW = require('../middlewares/schema_mw')
const debug = require('debug')('hec:controller:report')

const {
  Report,
  ReportInfo
} = models

const reportController = {
  /** Open Reports */
  opening: {
    /**
     * Get all open reports
     */
    findAll (ctx) {
      return co(function * () {
        let openReportsData = yield Report.findAll({
          where: {
            is_open: true
          }
        })
        let openReports = openReportsData.map(data => data.dataValues)

        // Latest info of each report
        for (let openReport of openReports) {
          let { report_full_id } = openReport
          let latest = yield ReportInfo.findOne({
            where: {
              report_full_id
            },
            order: 'date'
          })
          openReport.latestInfo = latest.dataValues
        }

        ctx.body = openReports
      })
    }
  },
  /** Close Reports */
  closing: {
    /**
     * Get all close reports
     */
    findAll (ctx) {
      return co(function * () {
        let closeRepots = yield Report.findAll({
          where: {
            is_open: false
          }
        })
        ctx.body = closeRepots.map(data => data.dataValues)
      })
    },
    /**
     * Close a report
     */
    closeOne: compose([
      schemaMW({
        type: 'object',
        properties: {
          closed_at: {
            type: 'string'
          }
        },
        required: [
          'closed_at'
        ]
      }),
      (ctx) => {
        return co(function * () {
          let { report_full_id } = ctx.params
          let { closed_at } = ctx.request.body
          closed_at = new Date(closed_at)
          yield Report.update({
            is_open: false,
            closed_at
          }, {
            where: { report_full_id }
          })
          ctx.body = {
            success: true
          }
        })
      }
    ])
  }
}

module.exports = reportController
