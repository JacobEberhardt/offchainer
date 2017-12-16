// Import dependencies
const router = require('express').Router()
const payraise = require('../../models/payraise')
const db = require('../../models/database')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

// Routes

// Create Pay Raise Contract
router.post('/create', (req, res, next) => {
	payraise.create(req.body, res)
		.then(contract => response(res, 200, {address: contract.address}))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router

