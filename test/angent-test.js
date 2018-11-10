'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const agentFixtures = require('./fixtures/agent')

let db = null

let config = {
    logging: function () {}
}

let MetricStub = {
    belongsTo: sinon.spy()
}


let single = Object.assign({},agentFixtures.single)// Para tener una instancia por aparte
let AgentStub = null
let sandbox = null
let id = 1

test.beforeEach(async () =>{

    sandbox = sinon.sandbox.create()

    // Aqui se debe definir un sandbox para reiniciarlo cada vez q se llame una funcion por el spy por ej
    AgentStub = {
        hasMany: sandbox.spy()
    }

    AgentStub.finById = sandbox.stub()// Crea un stub, esta función existe dentro del modelo
    // Una funcion falsa q cada vez q lo llame con un argumento retorne lo siguiente
    // Como la funcion es async se debe retornar una promesa
    AgentStub.finById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)));

    const setupDatabase = proxyquire('../',{
        './models/agent': () => AgentStub,// Paso funcion que retorna AgentStub
        './models/metric': () => MetricStub
    })
    db = await setupDatabase(config)
})

test.afterEach(t => {
    //sandbox && sinon.sandbox.restore()// Si existe el sandbox, vuelva a recrear el sandbox
})

// Verificar que el agente exista
test('Agent', t =>{
    t.truthy(db.Agent, 'Agent service should exists')
})

test.serial('Setup',t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
})// Para garantizar q el entorno de stubs no este saturado

test.serial('Agent#findById', async t =>{
    let agent = await db.Agent.finById(1)
    t.true(AgentStub.finById.called, 'findById should be called on model')
    t.true(AgentStub.finById.calledOnce, 'findById should be called once')
    t.true(AgentStub.finById.calledWith(id), 'findById should be called with specifed id')
    t.deepEqual(agent, agentFixtures.byId(id), 'should be the same')
})