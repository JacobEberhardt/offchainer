const app = require('./server')
const http = require('http')

// Define values
const DEFAULT_PORT = 8000

// Set port
const port = process.env.PORT || DEFAULT_PORT
app.set('port', port)

// Create server
const server = http.createServer(app)
server.listen(port)
console.log('Server listens on port', port)
