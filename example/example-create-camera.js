#!/usr/bin/env node
/**
 * This is an example script for client of drone view share
 */

'use strict'

const { port } = require('@self/server/env')
const {
  COUNT = 120,
  INTERVAL = 2000,
  PROTOCOL = 'http',
  HOST = `localhost:${port.CAMERA}`
} = process.env
const { v4: newUUID } = require('uuid')
const co = require('co')
const fs = require('fs')
const aglob = require('aglob')
const asleep = require('asleep')
const colorprint = require('colorprint')
const arequest = require('arequest')

const baseUrl = `${PROTOCOL}://${HOST}`
let request = arequest.create({ jar: true })
let create = (pathname, config) => co(function * () {
  let { statusCode, body } = yield request(Object.assign({
    url: `${baseUrl}${pathname}`,
    method: 'POST'
  }, config))
  if (statusCode !== 201) {
    throw new Error(`Failed to create: ${JSON.stringify(body)} (at: ${pathname}, status code: ${statusCode})`)
  }
  return body.created
})

co(function * () {
  const mockImages = yield aglob(`${__dirname}/../server/misc/mocks/mock-images/*.jpg`)
  if (mockImages.length === 0) {
    throw new Error('mockImages not found')
  }
  {
    colorprint.notice('Start example client...')
    colorprint.trace(`Server URL: ${baseUrl}`)
    let cameraUUID = newUUID()
    let camera = yield create(`/rest/cameras`, {
      json: true,
      body: {
        // Human readable name
        name: `Example camera (${new Date().toLocaleDateString()})`,
        // Generated UUID,
        uuid: cameraUUID,
        // Key to identify user
        owner: 'demo'
      }
    })

    // Create photos
    for (let i = 0; i < Number(COUNT); i++) {
      let mockImage = mockImages.sort(() => Math.random() > 0.5)[ i % mockImages.length ]
      let photo = yield create(`/rest/cameras/${camera.uuid}/photos`, {
        formData: {
          // Additional info
          info: JSON.stringify({ foo: 'bar' }),
          // Access token
          token: camera.token,
          // File data
          image: fs.createReadStream(mockImage)
        }
      })
      let { cameraId, uuid, image } = photo
      colorprint.debug(`Photo uploaded: ${JSON.stringify({ cameraId, uuid, image })}`)
      yield asleep(INTERVAL)
    }
    colorprint.notice('...example client stopped!')
  }
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
