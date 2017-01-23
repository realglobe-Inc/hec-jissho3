/**
 * urls of entrypoints
 * UI でも使うので ES5 で書いた。
 */
var encode = require('urlencode')
var REST_URL= require('@self/server/lib/consts').REST_URL
var CAMERA_URL = REST_URL.OF_CAMERA
var REPORT_URL = REST_URL.OF_REPORT
var SHARE_URL = REST_URL.OF_SHARE

function replace (target, opt) {
  var keys = Object.keys(opt)
  var replaced = target
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var encoded = encode(opt[key])
    replaced = replaced.replace(':' + key, encoded)
  }
  return replaced
}

var urls = {
  /**
   * URL of camera server
   */
  camera: {
    createCamera: function () {
      return CAMERA_URL.CAMERAS
    },
    getCamera: function (camera_uuid) {
      return replace(CAMERA_URL.CAMERA, { camera_uuid: camera_uuid })
    },
    deleteCamera: function (camera_uuid) {
      return replace(CAMERA_URL.CAMERA, { camera_uuid: camera_uuid })
    },
    createPhoto: function (camera_uuid) {
      return replace(CAMERA_URL.PHOTOS, { camera_uuid: camera_uuid })
    },
    getPhoto: function (camera_uuid, photo_uuid) {
      return replace(CAMERA_URL.PHOTO, { camera_uuid: camera_uuid, photo_uuid: photo_uuid })
    },
    deletePhoto: function (camera_uuid, photo_uuid) {
      return replace(CAMERA_URL.PHOTO, { camera_uuid: camera_uuid, photo_uuid: photo_uuid })
    },
    getPhotoList: function (camera_uuid) {
      return replace(CAMERA_URL.PHOTO_LIST, { camera_uuid: camera_uuid })
    }
  },

  /**
   * URL of report server
   */
  report: {
    getOpenReports: function () {
      return REPORT_URL.OPEN_REPORTS
    },
    getClosedReports: function () {
      return REPORT_URL.CLOSE_REPORTS
    },
    closeReport: function (report_full_id) {
      return replace(REPORT_URL.CLOSE_REPORT, { report_full_id: report_full_id })
    }
  },

  /**
   * URL of share server
   */
  share: {
    photo: function () {
      return SHARE_URL.PHOTO
    },
    hash: function () {
      return SHARE_URL.HASH
    }
  }
}

module.exports = urls
