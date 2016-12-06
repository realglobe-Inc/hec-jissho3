/**
 * Test case for pub photo server.
 * Runs with mocha.
 */
'use strict'

const assert = require('assert')
const co = require('co')
const arequest = require('arequest')
const pubPhotoServer = require('@self/server/lib/pub_photo_server')
const asleep = require('asleep')
const { port } = require('@self/server/env')
const pubPhotoUrl = require('@self/server/helper/urls').pubPhoto
const sugoCaller = require('sugo-caller')
const { SUGOS, SUGOS_URL } = require('@self/server/lib/consts')

describe('PubPhoto server', function () {
  let request = arequest.create()
  this.timeout(15000)
  let baseUrl
  let actor

  before(() => co(function * () {
    baseUrl = `http://localhost:${port.PUB_PHOTO}`
    yield pubPhotoServer.listen(port.PUB_PHOTO)
    yield pubPhotoServer.actor.connect()
    let caller = sugoCaller({
      hostname: 'localhost',
      port: port.PUB_PHOTO,
      path: SUGOS_URL.PUB_PHOTO_PATH
    })
    actor = yield caller.connect(SUGOS.PUB_PHOTO_ACTOR.KEY)
  }))

  after(() => co(function * () {
    yield actor.disconnect()
    yield pubPhotoServer.actor.disconnect()
    yield pubPhotoServer.close()
  }))

  it('Api request', () => co(function * () {
    let camera_uuid = 'hoge'
    let photo_uuid = 'fuga'
    let pubPhoto = actor.get(SUGOS.PUB_PHOTO_ACTOR.MODULE)
    let updated = false
    pubPhoto.on(SUGOS.PUB_PHOTO_ACTOR.UPDATE_PHOTO_EVENT, () => {
      updated = true
    })
    {
      // Select a photo
      let url = `${baseUrl}${pubPhotoUrl.selectPhoto()}`
      let { statusCode, body } = yield request({
        url,
        method: 'POST',
        json: true,
        body: {
          camera_uuid,
          photo_uuid
        }
      })
      assert.ok(body.success)
      assert.equal(statusCode, 200)
    }
    {
      // Get the selected photo
      let url = `${baseUrl}${pubPhotoUrl.getPhoto()}`
      let { statusCode, body } = yield request({
        url,
        method: 'GET',
        json: true
      })
      assert.equal(body.camera_uuid, camera_uuid)
      assert.equal(body.photo_uuid, photo_uuid)
    }
    {
      // Caller recieves event
      yield asleep(500)
      assert.ok(updated)
    }
  }))
})

/* global describe, before, after, it */
