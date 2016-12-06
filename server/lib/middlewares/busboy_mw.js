/**
 * @function busboyMW
 */
'use strict'

const co = require('co')

const busboy = require('async-busboy')

/** @lends busboyMW */
function busboyMW () {
  return (ctx, next) => co(function * () {
    const { files, fields } = yield busboy(ctx.req)
    Object.assign(ctx, { files, fields })
    yield next()
  })
}

module.exports = busboyMW
