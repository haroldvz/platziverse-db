'use strict'

const setupDb = require('./lib/db')
const setupAgentmodel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const defaults = require('defaults')
const setupAgent = require('./lib/agent')
const setupMetric = require('./lib/metric')

module.exports = async function (config) {

  // Todo lo que venga en config lo deja, si no tiene estas propiedades, las escribe con estas por defecto
  config = defaults(config,{
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: { //para que cada query que se ejecute entregue JSON
      raw: true
    }
  })

  const sequelize = setupDb(config)
  const AgentModel = setupAgentmodel(config)
  const MetricModel = setupMetricModel(config)
  

  AgentModel.hasMany(MetricModel)// Agent tiene muchas metricas
  MetricModel.belongsTo(AgentModel)// Una metrica pertenece a un Agent

  await sequelize.authenticate()// validar que la bd este bien configurada (como esta await, la funcion pausa aqui y no pasa hasta que sea resuelta)

  if (config.setup) {
    await sequelize.sync({ force: true })// crear la bd en el servidor, con force true si la BD existe borra y crea una nueva
  }

  // sequelize.sync()// Toda la definicion de los modelos de la app si no existen entonces squelize lo va a crear

  //const Agent = setupAgent(AgentModel)
  const Agent = setupAgent(AgentModel)
  const Metric = setupMetric(MetricModel,AgentModel)

  return {
    Agent,
    Metric
  }
}
