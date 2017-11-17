// Import dependecies
const sqlize = require('sequelize')

// Define scheme
const db = global.db.define('offchainer',
	{
		key: {type: sqlize.STRING},
		message: {type: sqlize.STRING}
	},
	{timestamps: false}
)

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
