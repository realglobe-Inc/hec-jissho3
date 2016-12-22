/**
 * SUGO-Hub Server to manage UI
 */
const sugoHub = require('sugo-hub')
const env = require('@self/server/env')
const { join } = require('path')
const { SUGOS_URL } = require('./consts')
const createDataSyncActor = require('./helpers/data_sync_actor')
// const watchSharedPhoto = require('./helpers/post_ar_compass_caller.js')
const { UiServer } = require('./config')

let isTest = process.env.NODE_ENV === 'test'
let isProduction = process.env.NODE_ENV === 'production'

let config = {
  public: isProduction ? null : [
    join(__dirname, '../public')
  ],
  storage: isTest ? null : {
    redis: {
      url: env.redis.URL,
      db: UiServer.redisDb
    }
  },
  socketIoOptions: {
    path: SUGOS_URL.UI_PATH
  }
}

const uiServer = sugoHub(config)

uiServer.actor = createDataSyncActor()
// uiServer.watchSharedPhoto = watchSharedPhoto

module.exports = uiServer
