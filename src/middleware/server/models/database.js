// Import dependecies
const connection = require('../config/postgresql')

/**
 * The database class.
 */
function Database(tableName, scheme) {

	// Constructor
	this.db = connection.define(
		tableName,
		scheme,
		{
			timestamps: false, // No timestamps
			freezeTableName: true // Use table name as-is
		}
	)

	// Define functions	
	/**
	 * Check if a database connection exists.
	 *
	 * @throws Throws an error if there is no database connection
	 */
	this.checkConnection = function () {
		if (this.db == undefined) {
			var error = new Error('No database connection. Please retry again later.')
			error.code = 'database'
			throw error
		}
	}

	// "Low level" wrapper functions
	/**
	 * Insert a new row.
	 *
	 * @param {Object} data The row to insert
	 * @returns {Promise} The database response
	 */
	this.create = function (data) {
		this.checkConnection()
		return this.db.create(data)
	}

	/**
	 * Read a row.
	 *
	 * @param {Object} criteria The criteria for the row to read
	 * @returns {Promise} The database response
	 */
	this.read = function (criteria) {
		this.checkConnection()
		return this.db.findOne({where: criteria})
	}


	/**
	 * Read all rows.
	 *
	 * @param {Object} criteria The criteria for the row to read
	 * @returns {Promise} The database response
	 */
	this.readAllSort = function (criteria) {
		this.checkConnection()
		return this.db.findAll({order: criteria})
	}


/**
	 * Read all rows.
	 *
	 * @param {Object} criteria The criteria for the row to read
	 * @returns {Promise} The database response
	 */
	this.readAll = function (criteria) {
		this.checkConnection()
		return this.db.findAll({where: criteria})
	}
	/**
	 * Update a row.
	 *
	 * @param {Object} criteria The criteria for the row to update
	 * @param {Object} data The columns to update
	 * @returns {Promise} The database response
	 */
	this.update = function (criteria, data) {
		this.checkConnection()
		return this.db.update(data,
			{
				where: criteria,
				returning: true // Return the update result
			}
		)
	}

	/**
	 * Delete a row.
	 *
	 * @param {Object} criteria The criteria for the row to delete
	 * @returns {Promise} The database response
	 */
	this.destroy = function (criteria) {
		this.checkConnection()
		return this.db.destroy({where: criteria})
	}

}

// Export module
module.exports = Database 
