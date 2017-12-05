// Import dependencies
const router = require('express').Router()
const counter = require('../../models/counter')
const db = require('../../models/database')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

// Routes
/**
 * Create a new contract.
 */
router.post('/create', (req, res, next) => {
	counter.create()
		.then(contract => {
			counter.setInstance(contract.address) // Store the address
			response(res, 200, {address: contract.address})
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
	if (typeof(index) !== 'number' || index < 0 || index > 4) return badRequest()
	counter.increaseCounter(index)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router

