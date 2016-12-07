/**
 * urls of entrypoints
 * UI でも使うので ES5 で書いた。
 */
var encode = require('urlencode')
var { REST_URL } = require('@self/lib/consts')
var CAMERA_URL = REST_URL.OF_CAMERA
var REPORT_URL = REST_URL.OF_REPORT

function replace (target, opt) {
  var keys = Object.keys(opt)
  var replaced = target
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var encoded = encode(opt[key])
    replaced = replaced.replace(`:${key}`, encoded)
  }
  return replaced
}

var urls = {
  /**
   * URL of camera server
   */
  camera: {
    createCamera () {
      return CAMERA_URL.CAMERAS
    },
    getCamera (camera_uuid) {
      return replace(CAMERA_URL.CAMERA, { camera_uuid })
    },
    deleteCamera (camera_uuid) {
      return replace(CAMERA_URL.CAMERA, { camera_uuid })
    },
    createPhoto (camera_uuid) {
      return replace(CAMERA_URL.PHOTOS, { camera_uuid })
    },
    getPhoto (camera_uuid, photo_uuid) {
      return replace(CAMERA_URL.PHOTO, { camera_uuid, photo_uuid })
    },
    deletePhoto (camera_uuid, photo_uuid) {
      return replace(CAMERA_URL.PHOTO, { camera_uuid, photo_uuid })
    },
    getPhotoList (camera_uuid) {
      return replace(CAMERA_URL.PHOTO_LIST, { camera_uuid })
    }
  },

  /**
   * URL of report server
   */
  report: {
    getOpenReports () {
      return REPORT_URL.OPEN_REPORTS
    },
    getClosedReports () {
      return REPORT_URL.CLOSE_REPORTS
    },
    closeReport (report_full_id) {
      return replace(REPORT_URL.CLOSE_REPORT, { report_full_id })
    }
  }
}

module.exports = urls
