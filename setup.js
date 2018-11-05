'use strict'

const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')// require the index.js

const prompt = inquirer.createPromptModule()// Obj que permite hacer preguntas en la consola y tomar decisiones con ellas (son promesas, hay que resolver promesas)

async function setup () {

  // Esperar por prompt
  const asnwer = await prompt([{
    type: 'confirm',//pregunta si o no,
    name: 'setup',// la pregunta la guarda en propiedad llamada setup
    message: 'This will destroy your bd, are you sure?'
  }])

  if (!asnwer.setup){
    return console.log('Nothing happened ...')
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Succes')
  process.exit(0)
}

function handleFatalError (err) {
  console.log('HANDLER')
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(`${chalk.blue('[error stack]')} ${err.stack}`)
  process.exit(1)
}

setup()
