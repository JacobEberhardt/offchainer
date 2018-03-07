// Import dependencies
const Sequelize = require('sequelize')

// Check environment variables
const envVars = ['PG_HOST', 'PG_USER', 'PG_PORT']
for (let envVar of envVars) if (process.env[envVar] === undefined) throw Error(`Environment variable ${envVar} is not set`)

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
	operatorsAliases: false,
	define: {underscored: true}
})
