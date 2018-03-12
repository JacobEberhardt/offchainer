// Import dependencies
const express = require('express')
const bodyParser = require('body-parser')
const api = require('./api/api')

// Initialize server
const app = express()

// Disable X-Powered-By header
app.disable('x-powered-by')

// Parse JSON requests
app.use(bodyParser.json())

// Use API
app.use('/', api)

// Error handler
app.use(function(err, req, res, next) {
	console.error(err && err.hasOwnProperty('stack') ? err.stack : err)
	res.status(500).send('Internal error').end()
})

// Export module
module.exports = app
