// Import dependencies
const Sequelize = require('sequelize')

// Check environment variables
if (process.env.PG_HOST === undefined) throw ValueError('Environment variable PG_HOST is not set')
if (process.env.PG_PORT === undefined) throw ValueError('Environment variable PG_PORT is not set')
if (process.env.PG_USER === undefined) throw ValueError('Environment variable PG_USER is not set')

// Define values
const PG_HOST = process.env.PG_HOST
const PG_PORT = process.env.PG_PORT
const PG_USER = process.env.PG_USER
const PG_DATABASE = process.env.PG_DATABASE || ''

// Export connection pool
module.exports = new Sequelize(PG_DATABASE, PG_USER, '', {
	host: PG_HOST,
	port: PG_PORT,
	dialect: 'postgres',
	define: {underscored: true}
})
