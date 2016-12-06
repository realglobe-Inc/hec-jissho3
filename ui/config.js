/**
 * Get configurations
 * @function configs
 * @returns {Object}
 */
'use strict'
var cssVars = require('./scss/vars.json')

module.exports = {
  /* テーマカラー */
  color: cssVars['app-color'],
  /* Google Map API Key */
  apiKey: process.env.RG_GOOGLE_API_KEY,
  /* 地図のデフォルト中心かつ救急センターの位置 */
  mapCenter: {
    lat: 35.701562,
    lng: 139.753148
  }
}
