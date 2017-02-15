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
    dialect: CONFIG.DIALECT,
    pool: {
      max: 3,
      min: 0,
      idle: 10
    },
    logging: (data) => debug(data),
  })

  let model = sequelize.define(name, attributes, {
    freezeTableName: true
  })

  return model
}

module.exports = Model
