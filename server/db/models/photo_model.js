const Model = require('./model')
const Sequelize = require('sequelize')
const Camera = require('./camera_model')

const Photo = Model('photo', {
  /* image's URL */
  image: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  /* Additional information */
  info: {
    type: Sequelize.STRING,
    allowNull: true
  },
  /* Alt attribute */
  image_alt: {
    type: Sequelize.STRING,
    allowNull: true
  },
  /* UUID */
  uuid: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  }
})

Photo.belongsTo(Camera)

module.exports = Photo
