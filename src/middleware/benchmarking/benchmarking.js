const request = require('supertest')

PG_HOST=database
PG_PORT=5432
PG_USER=postgres
PG_DATABASE=offchainer
const server = require('../server/server.js')
const api = require('../api/api.js')

console.log("I got called.")
