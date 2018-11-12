'use strict'

module.exports = function setupAgent(AgentModel) {
    function findById(id) {
        return AgentModel.findById(id) //sequelize function
    }

    function findByUuid(uuid) {
        return AgentModel.findOne({ //sequelize function
            where: {
                uuid
            }
        })
    }

    function findAll() {
        return AgentModel.findAll() //sequelize function
    }

    function findConnected() {
        return AgentModel.findAll({
            where: {
                connected: true
            }
        })
    }

    function findByUsername() {
        return AgentModel.findAll({
            where: {
                username,
                connected: true
            }
        })
    }

    async function createOrUpdate(agent) {
        const cond = {// sql cond
            where: {
                uuid: agent.uuid
            }
        }

        const existingAgent = await AgentModel.findOne(cond)// findOne es una funcion de sequelize que va a retornar la primera ocurrencia que cumpla con la condicion que se le pasa

        if (existingAgent) {
            console.log('ExistingAgent',existingAgent)
            const updated = await AgentModel.update(agent, cond)//sequelize function
            return updated ? AgentModel.findOne(cond) : existingAgent // si no lo actualiza retorno el agente existente
        }

        const result = await AgentModel.create(agent)//sequelize function
        return result.toJSON()

    }


    return {
        createOrUpdate,
        findById,
        findByUuid,
        findAll,
        findConnected,
        findByUsername
    }
}