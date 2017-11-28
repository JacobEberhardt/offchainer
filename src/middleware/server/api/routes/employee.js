// Import dependencies
const router = require('express').Router()
const employee = require('../../models/employee')
const db = require('../../models/database')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

// Routes
/**
 * Create a new contract.
 */
router.post('/pay-raise-contract', (req, res, next) => {
	employee.createPayRaiseContract(req.body.percentage, req.body.department, req.body.fromEntryDate ,res)
		.then(contract => {
			employee.setInstance(contract.address) // Store the address
			response(res, 200, {address: contract.address})
		})
		.catch(err => error(res, 500, err))
})

router.post('/increase-salary', (req, res, next) => {
	employee.increaseSalary()
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router

