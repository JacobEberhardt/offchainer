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
router.post('/', (req, res, next) => {
	employee.createPayRaiseContract(req.body, res)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router

