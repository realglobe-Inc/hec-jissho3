const Sequelize = require('sequelize')
const CONFIG = require('../../env').database
const debug = require('debug')('hec:db')

/**
 * Make Model
 */
function Model (name, attributes) {
  let sequelize = new Sequelize(CONFIG.DATABASE, CONFIG.ROOT_USER, CONFIG.ROOT_PASSWORD, {
    host: CONFIG.HOST,
    port: CONFIG.PORT,
    protocol: CONFIG.PROTOCOL,
    dialect: CONFIG.DIALECT,
    pool: {
      max: 5,
      min: 0,
      idle: 100
    },
    logging: (data) => debug(data),
    storage: CONFIG.STORAGE
  })

  let model = sequelize.define(name, attributes, {
    freezeTableName: true
  })

  return model
}

module.exports = Model
