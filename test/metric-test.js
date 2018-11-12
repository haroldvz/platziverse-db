'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const metricFixtures = require('./fixtures/metric')

let db = null

let config = {
    logging: function () { }
}

let AgentStub = null
let sandbox = null

AgentStub = {
    hasMany: sinon.spy()
}

test.beforeEach(async () => {

    sandbox = sinon.sandbox.create()

    let MetricStub = {
        belongsTo: sandbox.spy()
    }

    const setupDatabase = proxyquire('../', {
        './models/agent': () => AgentStub,// Paso funcion que retorna AgentStub
        './models/metric': () => MetricStub
    })
    db = await setupDatabase(config)

    

})

test('Metric', t => {
    t.truthy(db.Metric, 'Metric service should exists')
})