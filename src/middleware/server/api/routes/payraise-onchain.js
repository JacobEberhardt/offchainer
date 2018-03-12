// Import dependencies
const router = require('express').Router()
const payraise = require('../../models/payraise-onchain')
const res = require('../../utils/response')
const toMilliSeconds = require('../../utils/hrtime')

// Set response functions
const response = res.response
const error = res.error

// Routes
// Create Pay Raise Contract
router.post('/create', (req, res, next) => {
	var startTime = process.hrtime()
	payraise.create(req.body, res)
		.then(result => {
			var elapsedMilliseconds = toMilliSeconds(process.hrtime(startTime))
			response(res, 200, {address: result.contract.address, transaction: result.receipt, milliSeconds: elapsedMilliseconds})
		})
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router
