// Import dependencies
const router = require('express').Router()
const payraise = require('../../models/payraiseOnchain')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

// Routes

// Create Pay Raise Contract
router.post('/create', (req, res, next) => {
	payraise.create(req.body, res)
		.then(result => {
			response(res, 200, {address: result.contract.address, transaction: result.receipt})
		})
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router
