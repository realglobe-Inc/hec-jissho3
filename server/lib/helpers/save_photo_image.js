/**
 * @function savePhotoImage
 */
'use strict'

const env = require('@self/server/env')
const { PHOTO_DIR, PUBLIC_DIR } = env.paths
const fs = require('fs')
const path = require('path')
const co = require('co')
const mkdirp = require('mkdirp')
const promisify = require('es6-promisify')
const mkdirpAsync = promisify(mkdirp)

/** @lends savePhotoImage */
function savePhotoImage (camera, photo, stream, options = {}) {
  return co(function * () {
    let filename = path.join(
        PHOTO_DIR, camera.uuid, photo.uuid
      ) + options.extension
    let absPath = path.join(__dirname, '../..', filename)
    yield mkdirpAsync(path.dirname(absPath))
    let write = fs.createWriteStream(absPath)
    stream.pipe(write)
    yield new Promise((resolve, reject) => {
      write
        .on('close', () => resolve())
        .on('error', (err) => reject(err))
    })
    return '/' + path.relative(PUBLIC_DIR, filename)
  })
}

module.exports = savePhotoImage
