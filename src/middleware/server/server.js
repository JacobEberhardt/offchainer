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
	console.error(err.stack)
	res.writeHead(500)
	res.write('Internal error')
	res.end()
})


module.exports = app;
