/**
 * @function schemaMW
 */
'use strict'

const co = require('co')
const aschema = require('aschema')

/** @lends schemaMW */
function schemaMW (schema) {
  return (ctx, next) => co(function * () {
    let error = aschema(schema).validate(ctx.request.body)
    if (error) {
      ctx.status = 400
      ctx.body = {
        valid: false,
        errors: error.error
      }
      return
    }
    yield next()
  })
}

module.exports = schemaMW
