/**
 * Rest server to uploade images
 */
'use strict'

const sgServer = require('sg-server')
const endpoints = require('./endpoints/camera')
const photoMonitorActor = require('./helpers/photo_monitor_actor')

let cameraServer = sgServer({ endpoints })

cameraServer.photoMonitorActor = photoMonitorActor

module.exports = cameraServer
