/**
 * SUGO-Hub Server to manage reports
 */
const sugoHub = require('sugo-hub')
const env = require('@self/server/env')
const endpoints = require('./endpoints/report')
const Observer = require('./helpers/report_observer')
const { SUGOS_URL } = require('./consts')
const { ReportServer } = require('./config')

let isTest = process.env.NODE_ENV === 'test'
let config = {
  endpoints,
  storage: isTest ? null : {
    redis: {
      url: env.redis.URL,
      db: ReportServer.redisDb
    }
  },
  socketIoOptions: {
    path: SUGOS_URL.REPORT_PATH
  }
}

let reportServer = sugoHub(config)

/**
 * Create report observer
 */
reportServer.createObserver = () => {
  return new Observer()
}

module.exports = reportServer
