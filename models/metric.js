'use strict'

const Sequelize = require('sequelize')

const setupDatabase = require('../lib/db')

module.exports = function setupMetricModel (config) {
  const sequelize = setupDatabase(config)

  // sequelize.define makes the sql table with name metrics in plural
  return sequelize.define('metric', {

    type: {
      type: Sequelize.STRING,
      allowNull: false// no permits null data
    }

  })
}
