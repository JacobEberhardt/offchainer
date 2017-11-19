// Import dependecies
const Sequelize = require('sequelize')
const connection = require('../config/postgresql')

// Define table
const db = connection.define('offchainer',
	{ // Define scheme
		key: {type: Sequelize.STRING},
		message: {type: Sequelize.STRING}
	},
	{ // Options
		timestamps: false, // No timestamps
		freezeTableName: true // Use table name as-is
	}
)
db.sync() // Create database if it doesn't exist

// Define functions
/**
 * Store a given message in the database.
 *
 * @param {String} hash The hash of the given message
 * @param {String} message The given message
 * @returns {Promise} A promise which depends on the database response
 */
function setMessage(hash, message) {
	return db.create({
		key: hash,
		message: message
	})	
}

/**
 * Get the message for a given hash.
 *
 * @param {String} hash The given hash
 * @returns {Promise} A promise which depends on the database response
 */
function getMessage(hash) {
	return db.findOne({
		where: {key: hash}
	})
}

// Export module
module.exports = {
	setMessage,
	getMessage
}
