#!/usr/bin/env node
/**
 * プロキシ経由で実行する
 */

'use strict'

const { port, camera } = require('@self/server/env')
const {
  COUNT = 100,
  INTERVAL = 2000,
  PROTOCOL = 'http',
  HOST = `localhost:${port.DEV}`
} = process.env
const { v4: newUUID } = require('uuid')
const co = require('co')
const fs = require('fs')
const aglob = require('aglob')
const asleep = require('asleep')
const colorprint = require('colorprint')
const arequest = require('arequest')

const baseUrl = `${PROTOCOL}://${HOST}/jissho2`
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
