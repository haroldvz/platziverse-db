'use strict'

const debug = require('debug')('platziverse:db:setup')

// Objeto de configuración de la Base de Datos
module.exports = function (init = false) {
  return {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: init // Rebuild database
  }
}