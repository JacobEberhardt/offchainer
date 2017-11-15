// Import dependencies
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')

// Define values
const DEFAULT_PORT = 8000

// Initialize server
const app = express()

// Disable X-Powered-By header
app.disable('x-powered-by')

// Parse JSON requests
app.use(bodyParser.json())

// Error handler
app.use(function(err, req, res, next) {
	res.writeHead(500)
	res.write('Internal error')
	res.end()
})

// Set port
const port = DEFAULT_PORT
app.set('port', port)

// Create server
const server = http.createServer(app)
server.listen(port)
