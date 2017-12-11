// Import dependencies
const router = require('express').Router()
const counter = require('../../models/counterOnchain')
const db = require('../../models/database')
const res = require('../../utils/response')
const type = require('../../utils/type')

// Set response functions
const response = res.response
const error = res.error

// Routes
/**
 * Create a new contract.
 */
router.post('/create', (req, res, next) => {
	counter.create()
		.then(result => {
			counter.setInstance(result.contract.address) // Store the address
			response(res, 200, {address: result.contract.address, transaction: result.receipt})
		})
		.catch(err => error(res, 500, err))
})

router.post('/increase/:index', (req, res, next) => {
	var index
	const badRequest = () => response(res, 400, 'Invalid index.')
	try {
		index = parseInt(req.params.index)
	}
	catch (err) {
		badRequest()
	}
	if (!type.isInt(index) || index < 0 || index > 15) return badRequest()
	counter.increaseCounter(index)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router
