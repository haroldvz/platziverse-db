'use strict'

const Sequelize = require('sequelize')

const setupDatabase = require('../lib/db')

module.exports = function setupAgentModel (config) {
  const sequelize = setupDatabase(config)

  // sequelize.define makes the sql table with name agents in plural
  return sequelize.define('agent', {

    uuid: {
      type: Sequelize.STRING,
      allowNull: false// no permits null data
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false// no permits null data
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false// no permits null data
    },
    hostname: {
      type: Sequelize.STRING,
      allowNull: false// no permits null data
    },
    pid: {
      type: Sequelize.INTEGER,
      allowNull: false// no permits null data
    },
    connected: {
      type: Sequelize.BOOLEAN,
      allowNull: false, // no permits null data
      defaultValue: false
    }

  })
}
