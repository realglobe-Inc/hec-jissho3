/**
 * Test case for report server.
 * Runs with mocha.
 */
'use strict'

const assert = require('assert')
const co = require('co')
const arequest = require('arequest')
const reportServer = require('@self/server/lib/report_server')
const { port } = require('@self/server/env')
const asleep = require('asleep')
const db = require('@self/server/db')
const reportUrl = require('@self/server/helper/urls').report
const sugoCaller = require('sugo-caller')
const sugoActor = require('sugo-actor')
const { Module } = sugoActor
const { SUGOS, SUGOS_URL } = require('@self/server/lib/consts')
const {
  REPORTER_MODULE,
  MASTER_ACTOR
} = SUGOS

describe('Report server', function () {
  let request = arequest.create({ jar: true })
  this.timeout(15000)
  let observer
  let baseUrl

  before(() => co(function * () {
    yield db.sync({ force: true })
    yield db.seed()
    baseUrl = `http://localhost:${port.REPORT}`
    yield reportServer.listen(port.REPORT)
    observer = reportServer.createObserver()
    yield observer.start()
  }))

  after(() => co(function * () {
    if (observer) {
      yield observer.stop()
    }
    yield reportServer.close()
    yield db.drop()
  }))

  it('Api request', () => co(function * () {
    let report_full_id
    // Get open reports
    {
      let url = `${baseUrl}${reportUrl.getOpenReports()}`
      let { statusCode, body } = yield request({
        url,
        method: 'GET',
        json: true
      })
      assert.ok(body.length > 0)
      assert.equal(statusCode, 200)
      report_full_id = body[0].report_full_id
    }
    // Close report
    {
      let url = `${baseUrl}${reportUrl.closeReport(report_full_id)}`
      let { statusCode, body } = yield request({
        url,
        method: 'POST',
        json: true,
        body: {
          closed_at: new Date()
        }
      })
      assert.ok(body.success)
      assert.equal(statusCode, 200)
    }
    // Get closed report
    {
      let url = `${baseUrl}${reportUrl.getClosedReports()}`
      let { statusCode, body } = yield request({
        url,
        method: 'GET',
        json: true
      })
      assert.equal(statusCode, 200)
      assert.ok(body.find(report => report.report_full_id === report_full_id))
    }
  }))

  it('Observer', () => co(function * () {
    let reportId = 1
    let actorKey = 'qq:reporter:99'
    let reportFullId = `${actorKey}#${reportId}`
    // Actor connection
    let reporter = new Module({
      report () {
        this.emit('emergency', {
          id: reportId,
          heartRate: 40,
          location: [1, 2, 3],
          date: (new Date()).toString()
        })
      }
    })
    let reportActor = sugoActor({
      port: port.REPORT,
      key: actorKey,
      modules: {
        reporter
      },
      path: SUGOS_URL.REPORT_PATH
    })
    yield reportActor.connect()
    yield asleep(1000)

    // Connect master actor
    let caller = sugoCaller({
      protocol: 'http',
      host: `localhost:${port.REPORT}`,
      path: SUGOS_URL.REPORT_PATH
    })
    let masterActor = yield caller.connect(MASTER_ACTOR.KEY)
    let masterReporter = masterActor.get(MASTER_ACTOR.MODULE)
    let gotReport = null
    masterReporter.on(MASTER_ACTOR.REPORT_INFO_EVENT, (data) => {
      gotReport = data
    })
    assert.ok(masterReporter)
    // Emit report
    yield asleep(1000)
    reporter.report()
    yield asleep(2000)
    let { body: reports } = yield request({
      url: `${baseUrl}${reportUrl.getOpenReports()}`,
      method: 'GET',
      json: true
    })
    assert.ok(reports.find((report) => report.report_full_id === reportFullId))

    yield caller.disconnect(MASTER_ACTOR.KEY)
    yield reportActor.disconnect()
    yield asleep(200)
  }))
})

/* global describe, before, after, it */
