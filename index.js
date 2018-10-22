'use strict'

const setupDb = require('./lib/db')
const setupAgentmodel = require('./models/agent')
const setupMetricModel = require('./models/metric')

module.exports = async function (config) {
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

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
