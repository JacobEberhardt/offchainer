// Import dependecies
const sqlize = require('sequelize')

// Define scheme
const db = global.db.define('offchainer',
	{message: {type: sqlize.STRING}},
	{timestamps: false}
)

// Define functions
/**
 * Store a given message in the database
 *
 * @param {String} message The given message
 * @returns {Promise} A promise which depends on the database response
 */
function setMessage(message) {
	return db.create({
		message: message
	})	
}

/**
 * Get the message for a given ID
 *
 * @param {String} id The given ID
 * @returns {Promise} A promise which depends on the database response
 */
function getMessage(id) {
	return db.findOne({
		where: {id: id}
	})
}

// Export module
module.exports = {
	setMessage,
	getMessage
}
