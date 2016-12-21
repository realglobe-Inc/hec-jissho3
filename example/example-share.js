#!/usr/bin/env node
/**
 * 画像をシェアする。
 */
const co = require('co')
const fs = require('fs')
const { port } = require('@self/server/env')
const request = require('request')
const { join } = require('path')

const { REST_URL } = require('@self/server/lib/consts')

const URL = (process.env.URL || `http://localhost:${port.SHARE}`)
const WAIT = process.env.WAIT || 10000

co(function * () {
  console.log('Upload URL:', URL)
  let nums = (new Array(10)).fill(0).map((n, i) => i)
  for (let i of nums) {
    let imagePath = join(__dirname, `../server/misc/mocks/mock-images/0${i}.jpg`)
    // POST
    yield new Promise((resolve, reject) => {
      request.post({
        url: URL + REST_URL.OF_SHARE.PHOTO,
        formData: {
          img: fs.createReadStream(imagePath)
        }
      }, (err, res, body) => {
        if (err) {
          reject(err)
        }
        if (res.statusCode !== 200) {
          reject(res.body)
        }
        resolve()
      })
    })

    console.log('Uploaded', imagePath)

    // wait
    yield new Promise((resolve) => {
      setTimeout(() => { resolve() }, WAIT)
    })
  }
}).catch(err => console.log(err))