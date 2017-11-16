// Import dependencies
const router = require('express').Router()
const offchainer = require('../models/offchainer')

/**
 * Send a JSON response.
 *
 * @param {Object} res The response object
 * @param {Number} status The status code for the response
 * @param {Object} text A JSON object which contains any additional data
 */
function response(res, status, text) {
	var obj = {status: status}
	if (text) obj.text = text
	res.writeHead(status, {'Content-Type': 'application/json'})
	res.write(JSON.stringify(obj))
	res.end()
}

/**
 * Send an error response.
 *
 * @param {Object} res The response object
 * @param {Number} status The status code for the response
 * @param {String} err An error message which gets logged
 */
function error(res, status, err) {
	console.log(err)
	response(res, status)
}

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
		.catch(err => {
			error(res, 500, err)
		})
})

/**
 * Set the message to a given string.
 */
router.post('/message', (req, res, next) => {
	if (!offchainer.hasAddress()) return response(res, 400, 'Create a contract first') // Check if a contract was created
	if (!req.body.message || typeof(req.body.message) != 'string') return response(res, 400, 'Invalid message')	// Check if the given message is valid
	offchainer.setMessage(req.body.message)
		.then(hash => {
			response(res, 200, {hash: hash})
		})
		.catch(err => {
			error(res, 500, err)
		})
})

/**
 * Perform an integrity check on the given string.
 */
router.post('/verify', (req, res, next) => {
	if (!offchainer.hasAddress()) return response(res, 400, 'Create a contract first') // Check if a contract was created
	if (!req.body.message || typeof(req.body.message) != 'string') return response(res, 400, 'Invalid message')	// Check if the given message is valid
	offchainer.checkMessage(req.body.message)
		.then(success => {
			response(res, 200, {success: success})
		})
		.catch(err => {
			error(res, 500, err)
		})
})

// 404 fallback
router.all('/*', (req, res, next) => {
	error(res, 404)
})

module.exports = router
