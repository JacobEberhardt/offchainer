// Import dependencies
const router = require('express').Router()
const Sequelize = require('sequelize')
const Database = require('../../models/database')
const offchainer = require('../../models/offchainer')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

// Initialize database connection
const db = new Database(
	'offchainer',
	{
		key: {type: Sequelize.STRING},
		message: {type: Sequelize.STRING}
	}
)

console.log(db)

// Routes
/**
 * Create a new contract.
 */
router.post('/create', (req, res, next) => {
	offchainer.create(res)
		.then(contract => {
			offchainer.setAddress(contract.address) // Store the address
			response(res, 200, {address: contract.address})
		})
		.catch(err => error(res, 500, err))
})

/**
 * Set the message to a given string.
 */
router.post('/message', (req, res, next) => {
	if (!offchainer.hasAddress()) return response(res, 400, 'Create a contract first') // Check if a contract was created
	if (!req.body.message || typeof(req.body.message) != 'string') return response(res, 400, 'Invalid message')	// Check if the given message is valid
	offchainer.setMessage(req.body.message)
		.then(hash => db.create({key: hash, message: req.body.message}))
		.then(result => response(res, 200, {hash: result.key}))
		.catch(err => error(res, 500, err))
})

/**
 * Perform an integrity check on the given string.
 */
router.post('/verify', (req, res, next) => {
	if (!offchainer.hasAddress()) return response(res, 400, 'Create a contract first') // Check if a contract was created
	if (!req.body.hash || typeof(req.body.hash) != 'string') return response(res, 400, 'Invalid hash') // Check if a contract was created
	db.read({key: req.body.hash})
		.then(result => offchainer.checkMessage(result.message))
		.then(success => response(res, 200, {success: success}))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router
