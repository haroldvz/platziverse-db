'use strict'


module.exports = function setupMetric(MetricModel, AgentModel) {
    async function create(uuid, metric) {
        // verificar si existe el agente
        const agent = await AgentModel.findOne({
            where: {
                uuid
            }
        })

        if (agent) {// si el agente existe vamos a asignarle al obj metricas el agente
            Object.assign(metric, { agentId: agent.id })
            // en la logica de la aplicacion siempre voy a generar una metrica nueva nunca voy a actualizarle por eso no es createOrUpdate
            const result = await MetricModel.create(metric)
            return result.toJSON()
        }
    }

    async function findByAgentUuid(uuid) {
        return MetricModel.findAll({
            attributes: ['type'],
            group: ['type'],
            include: [{
                attributes: [],
                model: AgentModel,
                where: {
                    uuid
                }
            }],
            raw: true
        })
    }

    async function findByTypeAgentUUid (type, uuid){
        return MetricModel.findAll({
            attributes: ['id', 'type', 'value', 'createdAt'],
            where:{
                type
            },
            limit: 20,
            order: [['createdAt', 'DESC']],
            include: [{
                attributes: [],
                model: AgentModel,
                where:{
                    uuid
                }
            }],
            raw: true
        })
    }


    return {
        create,
        findByAgentUuid,
        findByTypeAgentUUid
    }
}