const { port } = require('../env')
const { SUGOS_URL } = require('./consts')

let isTest = process.env.NODE_ENV === 'test'

module.exports = {
  // Report Server の Master Actor の接続先
  ReportServer: {
    redisDb: 2,
    masterActorConifg: {
      protocol: 'http',
      hostname: 'localhost',
      port: isTest ? port.REPORT : port.UI,
      path: SUGOS_URL.UI_PATH
    },
    observerConfig: {
      protocol: 'http',
      hostname: 'localhost',
      port: port.REPORT,
      path: SUGOS_URL.REPORT_PATH
    },
    callerConfig: {
      protocol: 'http',
      hostname: 'localhost',
      port: port.REPORT,
      path: SUGOS_URL.REPORT_PATH
    }
  },
  // Camera server の notify Actor の接続先
  CameraServer: {
    cameraActorConfig: {
      protocol: 'http',
      hostname: 'localhost',
      port: port.UI,
      path: SUGOS_URL.UI_PATH
    }
  },
  UiServer: {
    redisDb: 1
  }
}
