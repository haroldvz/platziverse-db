'use strict'

const agent = {
    id: 1,
    uuid: 'yyy-yyy-yyy',
    name: 'fixture',
    username: 'platzi',
    hostname: 'testhost',
    pid:0,
    connected: true,
    createdAt: new Date(),
    updatedAt: new Date()
}

const agents = [
    agent,
    extend(agent,{id:2,uuid:'yyy-aaa-qqq',connected:false, username:'harold'}),
    extend(agent,{id:3,uuid:'yyy-aaa-qqq',connected:false, username:'harold'}),
    extend(agent,{id:4,uuid:'yyy-aaa-qqq',connected:true, username:'hvz'})
]
// Para reescribir un objeto, clonarlo y reemplazar valores
function extend (obj, values) {
    const clone = Object.assign({},obj)// ECMA5
    return Object.assign(clone,values)
}

// Esto es un mock del obj de base de datos
module.exports = {
    single: agent,
    all: agents,
    connected: agents.filter(a=>a.connected),// filtro arreglo para que retorne solo conectados
    platzi: agents.filter(a=>a.username === 'platzi'),
    byUuid: id => agents.filter(a=>a.uuid === id).shift(),// Para retornar solo el primero elemento
    byId: id => agents.filter(a=>a.id === id).shift()// Para retornar solo el primero elemento
}