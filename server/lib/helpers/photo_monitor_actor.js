const sugoActor = require('sugo-actor')
const { Module } = sugoActor
const { cameraActorConfig } = require('../config').CameraServer
const { Photo } = require('@self/server/db/models')
const { PHOTO_MONITOR_ACTOR } = require('../consts').SUGOS
const {
  KEY, MODULE, CREATED_EVENT, REMOVED_EVENT
} = PHOTO_MONITOR_ACTOR

const debug = require('debug')('hec:photo_monitor_actor')

function photoMonitorActor () {
  let emitter = new Module({})
  let config = Object.assign({
    key: KEY,
    modules: {
      [MODULE]: emitter
    }
  }, cameraActorConfig)
  let actor = sugoActor(config)

  debug(`Ahoto monitor actor to ${cameraActorConfig.hostname}:${cameraActorConfig.port}`)

  Photo.afterCreate('Notify to monitor actor', (data) => {
    debug('Event: create')
    emitter.emit(CREATED_EVENT, data.dataValues)
  })
  Photo.afterDestroy('Notify to monitor actor', (data) => {
    debug('Event: destroy')
    emitter.emit(REMOVED_EVENT, data.dataValues)
  })
  return actor
}

module.exports = photoMonitorActor
