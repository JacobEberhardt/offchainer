// Import dependencies
const Sequelize = require('sequelize')

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
