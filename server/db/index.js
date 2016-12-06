/**
 * Database methods
 */
const co = require('co')
const models = require('./models')
const fs = require('fs')
const promisify = require('es6-promisify')
const readdir = promisify(fs.readdir)
const colors = require('colors')
const debug = require('debug')('hec:db')

const db = {
  sync (options) {
    return co(function * () {
      let modelList = Object.keys(models).map((name) => models[name])
      for (let model of modelList) {
        yield model.sync(options)
        debug(`${model.name} created.`)
      }
    })
  },
  seed (options) {
    return co(function * () {
      let seedDir = `${__dirname}/seeds/${process.env.NODE_ENV || 'development'}`
      let seedFiles = yield readdir(seedDir)
      let seedPaths = seedFiles.map((file) => seedDir + '/' + file)
      for (let path of seedPaths) {
        let {model: name, seed} = require(path)
        let Model = models[name]
        for (let data of seed) {
          yield Model.create(data)
        }
        debug(`${name} seeded.`)
      }
    })
  },
  show (options) {
    return co(function * () {
      let modelList = Object.keys(models).map((name) => models[name])
      for (let model of modelList) {
        let all = yield model.findAll()
        console.log(colors.green(`--- ${model.name} ---`))
        console.log(all.map((data) => data.dataValues))
        console.log('')
      }
    })
  },
  drop (options) {
    return co(function * () {
      // 順番が大事
      let modelList = [
        'Photo',
        'Camera',
        'User',
        'ReportInfo',
        'Report'
      ]
      for (let name of modelList) {
        let model = models[name]
        yield model.drop(options)
        debug(`${model.name} dropped.`)
      }
    })
  }
}

module.exports = db
