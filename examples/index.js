'use strict'

const db = require('../index')
const debug = require('debug')('platziverseexample:run')
const inquirer = require('inquirer')
const chalk = require('chalk')

async function run() {
    const config = {
        database: process.env.DB_NAME || 'platziverse',
        username: process.env.DB_USER || 'platzi',
        password: process.env.DB_PASS || 'platzi',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: s => debug(s),
    }

    const { Agent, Metric } = await db(config).catch(handleFatalError)

    const agent = await Agent.createOrUpdate({
        uuid: 'yyyx',
        name: 'test',
        username: 'test',
        hostname: 'test',
        pid: 0,
        connected: true
    }).catch(handleFatalError)

    const agents = await Agent.findAll()

    console.log('agent',agent)
    console.log('agents',agents)

    const metric = await Metric.create(agent.uuid,{//sin await no funciona
        type:'memory',
        value:'300'
    }).catch(handleFatalError)

    const otherMetric = await Metric.create(agent.uuid,{//sin await no funciona
        type:'red',
        value:'300'
    }).catch(handleFatalError)

    console.log('metric',metric)

    const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)
    console.log('metrics',metrics)

    const metricsByType = await Metric.findByTypeAgentUUid('red',agent.uuid).catch(handleFatalError)
    console.log('metricsByType',metricsByType)

    
}

function handleFatalError (err) {
    console.log('HANDLER')
    console.error(`${chalk.red('[fatal error]')} ${err.message}`)
    console.error(`${chalk.blue('[error stack]')} ${err.stack}`)
    process.exit(1)
  }

run()