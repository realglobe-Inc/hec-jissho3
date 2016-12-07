/**
 * Test case for report server.
 * Runs with mocha.
 */
'use strict'

const assert = require('assert')
const co = require('co')
const arequest = require('arequest')
const uiServer = require('@self/server/lib/ui_server')
const { port } = require('@self/server/env')
const asleep = require('asleep')
const sugoCaller = require('sugo-caller')
const sugoActor = require('sugo-actor')
const sgServer = require('sg-server')
const { Module } = sugoActor
const { SUGOS, SUGOS_URL } = require('@self/server/lib/consts')
const {
  DATA_SYNC_ACTOR
} = SUGOS

describe('UI server', function () {
  let request = arequest.create({ jar: true })
  this.timeout(15000)
  let compassCaller
  let mockServer
  let postedLocation

  before(() => co(function * () {
    yield uiServer.listen(port.UI)
    yield uiServer.actor.connect()
    compassCaller = yield uiServer.watchSharedPhoto()

    mockServer = sgServer({
      endpoints: {
        '/ar-compass/location': {
          POST: (ctx) => {
            postedLocation = ctx.request.body
          }
        }
      }
    })
    yield mockServer.listen(port.AR_COMPASS)
  }))

  after(() => co(function * () {
    compassCaller.disconnect(DATA_SYNC_ACTOR.KEY)
    yield uiServer.actor.disconnect()
    yield uiServer.close()
    yield mockServer.close()
  }))

  it('POST to AR server', () => co(function * () {
    let caller = sugoCaller({
      protocol: 'http',
      host: `localhost:${port.UI}`,
      path: SUGOS_URL.UI_PATH
    })
    let actor = yield caller.connect(DATA_SYNC_ACTOR.KEY)
    let syncer = actor.get(DATA_SYNC_ACTOR.MODULE)
    let key = 'sharedReport'
    let location = { lat: 1, lng: 2 }
    let nextValue = {
      latestInfo: { location }
    }
    yield syncer.update({key, nextValue})
    yield asleep(500)
    
    assert.ok(postedLocation)
    assert.equal(location.lat, postedLocation.lat)
    assert.equal(location.lng, postedLocation.lng)

    yield caller.disconnect(DATA_SYNC_ACTOR.KEY)
  }))
})

/* global describe, before, after, it */
