/**
 * @function onePhotoMW
 */
'use strict'

const co = require('co')

/** @lends onePhotoMW */
function onePhotoMW (Photo) {
  return (ctx, next) => co(function * () {
    let { photo_uuid: uuid } = ctx.params
    let photo = (yield Photo.findOne({ where: { uuid } })) || (yield Photo.findOne({ where: { key: uuid } }))
    if (photo) {
      ctx.photo = photo
      yield next()
    } else {
      ctx.status = 404
      ctx.body = {
        errors: [
          `Photo not found with uuid: ${uuid}`
        ]
      }
    }
  })
}

module.exports = onePhotoMW
