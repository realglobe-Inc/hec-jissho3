/**
 * Endpoints for share
 * @module shareController
 */
'use strict'

const filecopy = require('filecopy')
const calcHash = require('md5-file/promise')
const co = require('co')
const fs = require('fs')
const { join } = require('path')
const { paths } = require('@self/server/env')
const debug = require('debug')('hec:share:controller')

const SHARE_PATH = join(__dirname, '../..', paths.SHARE_PATH)

// Variables in the controller
let hash = ''
let isUploading = false

function waitUntilUploaded () {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      reject(new Error())
    }, 10 * 1000)
    let timer = setInterval(() => {
      if (!isUploading) {
        clearInterval(timer)
        clearTimeout(timeout)
        resolve()
      }
    }, 50)
  })
}

/** @lends shareController */
const shareController = {
  /**
   * Get a photo
   */
  one: (ctx) => co(function * () {
    yield waitUntilUploaded()
    let imgData = yield new Promise((resolve, reject) => {
      fs.readFile(SHARE_PATH, (err, data) => {
        err ? reject(err) : resolve(data)
      })
    })
    ctx.body = imgData
  }),
  /**
   * Create a photo
   */
  create: (ctx) => co(function * () {
    let { img } = ctx.request.body.files
    isUploading = true
    yield filecopy(img.path, SHARE_PATH, { mkdirp: true })
    isUploading = false
    hash = yield calcHash(SHARE_PATH)
    debug('Uploaded', hash)
    ctx.body = JSON.stringify({ success: true })
  }),
  /**
   * Get a photo hash
   */
  hash: (ctx) => co(function * () {
    ctx.body = { hash }
  }),
}

module.exports = shareController
