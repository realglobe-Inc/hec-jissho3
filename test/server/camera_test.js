/**
 * Test case for Camera server.
 * Runs with mocha.
 */
'use strict'

const assert = require('assert')
const co = require('co')
const arequest = require('arequest')
const cameraServer = require('../../server/lib/camera_server')
const fs = require('fs')
const aport = require('aport')
const db = require('../../server/db')
const cameraUrl = require('../../server/helper/urls').camera

describe('Camera server', function () {
  let request = arequest.create({ jar: true })
  this.timeout(10000)
  let restPort
  before(() => co(function * () {
    yield db.sync({ force: true })
    yield db.seed()
    restPort = yield aport()
    yield cameraServer.listen({ port: restPort })
  }))

  after(() => co(function * () {
    yield cameraServer.close()
    yield db.drop()
  }))

  it('Api request', () => co(function * () {
    let baseUrl = `http://localhost:${restPort}`
    let uuid, token, photo_uuid
    // Create camera
    {
      let url = `${baseUrl}${cameraUrl.createCamera()}`
      let { statusCode, body } = yield request({
        url: url,
        method: 'POST',
        json: true,
        body: {
          name: 'test-camera-01',
          owner: 'demo'
        }
      })
      assert.equal(statusCode, 201)
      let { created } = body
      assert.ok(created)
      uuid = created.uuid
      token = created.token
    }
    // Get camera
    {
      let url = `${baseUrl}${cameraUrl.getCamera(uuid)}?token=${token}`
      let { statusCode, body } = yield request({
        url: url,
        method: 'GET'
      })
      assert.equal(statusCode, 200)
      assert.equal(body.uuid, uuid)
    }
    // Post image to the camera
    {
      let url = `${baseUrl}${cameraUrl.createPhoto(uuid)}`
      let image = `${__dirname}/../../server/misc/mocks/mock-images/01.jpg`
      let { statusCode, body } = yield request({
        url: url,
        method: 'POST',
        formData: {
          token,
          info: JSON.stringify({ foo: 'This is foo' }),
          extension: '.jpg', // File extension
          image: fs.createReadStream(image)
        }
      })
      assert.equal(statusCode, 201)
      let { created } = body
      assert.ok(created)
      photo_uuid = created.uuid
    }
    // Get image
    {
      let url = `${baseUrl}${cameraUrl.getPhoto(uuid, photo_uuid)}?token=${token}`
      let { statusCode, body } = yield request({
        url,
        method: 'GET'
      })
      assert.equal(statusCode, 200)
      assert.ok(body)
    }
    // Delete image
    {
      let url = `${baseUrl}${cameraUrl.deletePhoto(uuid, photo_uuid)}?token=${token}`
      let { statusCode, body } = yield request({
        url,
        method: 'DELETE'
      })
      assert.equal(statusCode, 200)
      assert.ok(body)
    }
  }))
})

/* global describe, before, after, it */
