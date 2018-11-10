'use strict'

module.exports = function setupAgent (AgentModel){
    function finById(id) {
        return AgentModel.finById(id)
    }

    return {
        finById
    }
}