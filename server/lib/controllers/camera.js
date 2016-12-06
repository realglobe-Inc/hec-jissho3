/**
 * Endpoints for camera
 * @module cameraController
 */
'use strict'

const co = require('co')
const uuid = require('uuid')
const { clone } = require('asobj')
const models = require('@self/db/models')
const compose = require('sg-server/lib/compose')
const generateToken = require('@self/helper/generate_token')
const savePhotoImage = require('../helpers/save_photo_image')
const oneCameraMW = require('../middlewares/one_camera_mw')
const onePhotoMW = require('../middlewares/one_photo_mw')
const schemaMW = require('../middlewares/schema_mw')
const busboyMW = require('../middlewares/busboy_mw')

const {
  Camera,
  Photo,
  User
} = models

/** @lends cameraController */
const cameraController = {
  /**
   * Get a camera
   */
  one: compose([
    oneCameraMW(Camera),
    (ctx) => {
      let { camera } = ctx
      ctx.body = camera
    }
  ]),
  /**
   * Create a camera
   */
  create: compose([
    schemaMW({
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 2
        }
      },
      required: [
        'owner',
        'name'
      ]
    }),
    (ctx) => {
      let { body } = ctx.request
      let data = clone(body)
      return co(function * () {
        data.token = generateToken()
        let { owner: ownerKey } = data
        let owner = yield User.findOne({ where: { key: ownerKey } })
        if (!owner) {
          ctx.status = 401
          ctx.body = { errors: { owner: `Owner not found: ${ownerKey}` } }
          return
        }
        delete data.owner
        data.ownerId = owner.id
        data.uuid = uuid.v4()
        let created = yield Camera.create(data)
        ctx.status = 201
        ctx.body = { created }
        // notify({ event: 'rest:camera:created', data: { id: created.id } })
      })
    }
  ]),
  /**
   * Destroy a camera
   */
  destroy: compose([
    oneCameraMW(Camera),
    (ctx) => {
      let { camera } = ctx
      return co(function * () {
        let destroyed = yield camera.destroy()
        ctx.body = { destroyed }
      })
    }
  ]),

  photo: {
    /**
     * Create a photo
     */
    create: compose([
      busboyMW(),
      oneCameraMW(Camera),
      (ctx) => {
        let { body: data } = ctx.request
        let { camera, files, fields } = ctx
        return co(function * () {
          const {
            extension = '.png',
            info
          } = fields
          data.cameraId = camera.id
          data.uuid = uuid.v4()
          data.info = JSON.parse(info)
          data.image = yield savePhotoImage(camera, data, files[ 0 ], {
            extension
          })
          let created = yield Photo.create(data)
          ctx.status = 201
          ctx.body = { created }
          // notify({ event: 'rest:photo:created', data: { id: created.id, cameraId: camera.id } })
        })
      }
    ]),
    /**
     * Get a photo
     */
    one: compose([
      oneCameraMW(Camera),
      onePhotoMW(Photo),
      (ctx) => {
        let { photo } = ctx
        return co(function * () {
          ctx.body = photo
        })
      }
    ]),
    /**
     * Destroy a photo
     */
    destroy: compose([
      oneCameraMW(Camera),
      onePhotoMW(Photo),
      (ctx) => {
        let { photo } = ctx
        return co(function * () {
          let destroyed = yield photo.destroy()
          ctx.body = { destroyed }
        })
      }
    ]),
    /**
     * Get phtos list
     */
    list: compose([
      oneCameraMW(Camera),
      (ctx) => {
        let { camera } = ctx
        return co(function * () {
          let photos = yield Photo.findAll({
            where: {
              cameraId: camera.id
            }
          })
          ctx.body = photos
        })
      }
    ])
  }
}

module.exports = cameraController
