/**
 * @module endpoints
 */
'use strict'

const { REST_URL } = require('../consts')
const URL = REST_URL.OF_CAMERA
const controller = require('../controllers/camera')

module.exports = {
  [URL.CAMERAS]: {
    POST: controller.create
  },
  [URL.CAMERA]: {
    GET: controller.one,
    DELETE: controller.destroy
  },
  [URL.PHOTOS]: {
    POST: controller.photo.create
  },
  [URL.PHOTO]: {
    GET: controller.photo.one,
    DELETE: controller.photo.destroy
  },
  [URL.PHOTO_LIST]: {
    GET: controller.photo.list
  }
}
