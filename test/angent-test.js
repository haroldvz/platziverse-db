'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const agentFixtures = require('./fixtures/agent')

let db = null

let config = {
    logging: function () { }
}

let MetricStub = {
    belongsTo: sinon.spy()
}

let uuid = 'yyy-yyy-yyy'// debe ser el mismo de single

let single = Object.assign({}, agentFixtures.single)// Para tener una instancia por aparte
let AgentStub = null
let sandbox = null
let id = 1

let connectedArgs = {
    where: { connected:true }
}

let usernameArgs = {
    where: { username: 'platzi', connected: true }
}

let uuidArgs = {
    where: { uuid }
}

let newAgent = {
    uuid:'123-123-123',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 0,
    connected: false
}


test.beforeEach(async () => {

    sandbox = sinon.sandbox.create()

    // Aqui se debe definir un sandbox para reiniciarlo cada vez q se llame una funcion por el spy por ej
    AgentStub = {
        hasMany: sandbox.spy()
    }

    // Model findOne stub
    AgentStub.findOne = sandbox.stub()
    AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

    //Model update stub
    AgentStub.update = sandbox.stub()
    AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))

    //Model create stub
    AgentStub.create = sandbox.stub()
    AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
        toJSON(){ return newAgent }// si no se pone toJSON dira que toJSON no es una funcion ya q esta definida en agent.js
    }))

    // Model findById stub
    AgentStub.findById = sandbox.stub()// Crea un stub, esta función existe dentro del modelo
    // Una funcion falsa q cada vez q lo llame con un argumento retorne lo siguiente
    // Como la funcion es async se debe retornar una promesa
    AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)));

    const setupDatabase = proxyquire('../', {
        './models/agent': () => AgentStub,// Paso funcion que retorna AgentStub
        './models/metric': () => MetricStub
    })
    db = await setupDatabase(config)
})

test.afterEach(t => {
    //sandbox && sinon.sandbox.restore()// Si existe el sandbox, vuelva a recrear el sandbox
})

// Verificar que el agente exista
test('Agent', t => {
    t.truthy(db.Agent, 'Agent service should exists')
})

test.serial('Setup', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
})// Para garantizar q el entorno de stubs no este saturado

test.serial('Agent#findById', async t => {
    let agent = await db.Agent.findById(1)
    t.true(AgentStub.findById.called, 'findById should be called on model')
    t.true(AgentStub.findById.calledOnce, 'findById should be called once')
    t.true(AgentStub.findById.calledWith(id), 'findById should be called with specifed id')
    t.deepEqual(agent, agentFixtures.byId(id), 'should be the same')
})

test.serial('Agent#createOrUpdate - When agent exists', async t => {
    let agent = await db.Agent.createOrUpdate(single)
    t.true(AgentStub.findOne.called, 'findOne should be called')
    t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
    t.true(AgentStub.update.calledOnce, 'findOne should be called once')
    t.deepEqual(agent, single, 'agent should be the same')
})

test.serial('Agent#createOrUpdate - When agent not exists', async t => {
    let agent = await db.Agent.createOrUpdate(newAgent)
    t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
    t.true(AgentStub.findOne.calledWith({
        where: { uuid: newAgent.uuid }
    }), 'findOne should be called once')
    t.true(AgentStub.create.calledOnce, 'create should be called once')
    t.true(AgentStub.create.calledWith(newAgent), 'create should be called once')
    //t.true(AgentStub.toJSON.calledOnce, 'toJSON should be called once')
    t.deepEqual(agent, newAgent, 'agent should be the same')
})