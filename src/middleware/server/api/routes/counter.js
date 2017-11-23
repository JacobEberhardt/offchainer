// Import dependencies
const router = require('express').Router()
const offchainer = require('../../models/counter')
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
	offchainer.create(res)
		.then(contract => {
			counter.setAddress(contract.address) // Store the address
			response(res, 200, {address: contract.address})
		})
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router

