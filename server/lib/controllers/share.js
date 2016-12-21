/**
 * Endpoints for share
 * @module shareController
 */
'use strict'

const filecopy = require('filecopy')
const calcHash = require('md5-file/promise')
const co = require('co')
const fs = require('fs')
const { exec } = require('child_process')
const compose = require('sg-server/lib/compose')
const { join } = require('path')
const { clone } = require('asobj')
const promisify = require('es6-promisify')
const schemaMW = require('../middlewares/schema_mw')
const { paths } = require('@self/server/env')
const debug = require('debug')('hec:share:controller')

const readFileAsync = promisify(fs.readFile)
const execAsync = promisify(exec)

const PUBLIC_DIR = join(__dirname, '../../public')
const MARK_COMMAND = join(__dirname, '../../helper/mark-on-image.sh') 

// Variables in the controller
let imagePath = ''
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
    let imgData = yield readFileAsync(imagePath)
    ctx.body = imgData
  }),
  /**
   * Create a photo
   */
  create: compose([
    schemaMW({
      type: 'object',
      properties: {
        image: {
          type: 'string'
        },
        circleCood: {
          type: 'string'
        }
      },
      required: [
        'image',
        'circleCood',
      ],
    }),
    (ctx) => co(function * () {
      let { body } = ctx.request
      let data = clone(body)
      let { image, circleCood } = data

      isUploading = true
      let output = yield execAsync(`${MARK_COMMAND} ${PUBLIC_DIR}${image} ${circleCood}`)
      imagePath = output.toString().trim()
      isUploading = false

      hash = yield calcHash(imagePath)
      debug('Uploaded', hash)
      ctx.body = { success: true }
    })
  ]),
  /**
   * Get a photo hash
   */
  hash: (ctx) => co(function * () {
    ctx.body = { hash }
  }),
}

module.exports = shareController
