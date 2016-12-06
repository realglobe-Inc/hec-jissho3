/**
 * Define one camera handler
 * @function oneCameraMW
 */
'use strict'

const co = require('co')

/** @lends oneCameraMW */
function oneCameraMW (Camera) {
  return (ctx, next) => co(function * () {
    let { camera_uuid: uuid } = ctx.params
    let token = String(ctx.query.token || ctx.params.token || (ctx.fields && {}).token).trim()
    let camera = yield Camera.findOne({ where: { uuid } })
    if (camera) {
      let ok = token === camera.token
      if (!ok) {
        ctx.status = 401
        ctx.body = {
          errors: [ `Invalid camera token: ${token}` ]
        }
      }
      ctx.camera = camera
      yield next()
    } else {
      ctx.status = 404
      ctx.body = {
        errors: [
          `Camera not found with uuid: ${uuid}`
        ]
      }
    }
  })
}

module.exports = oneCameraMW
