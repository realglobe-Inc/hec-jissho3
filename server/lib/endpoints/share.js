/**
 * @module endpoints
 */
'use strict'

const { REST_URL } = require('../consts')
const URL = REST_URL.OF_SHARE
const controller = require('../controllers/share')

module.exports = {
  [URL.PHOTO]: {
    POST: controller.create,
    GET: controller.one,
  },
  [URL.HASH]: {
    GET: controller.hash,
  }
}
