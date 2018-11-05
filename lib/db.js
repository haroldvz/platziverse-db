'use strict'

const Sequelize = require('sequelize')
let sequelize = null

// Singleton
module.exports = function setupDatabase (config) {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }
  return sequelize
}
