// Import dependencies
const router = require('express').Router()
const employee = require('../../models/employee-onchain')
const res = require('../../utils/response')
const toMilliSeconds = require('../../utils/hrtime')

// Set response functions
const response = res.response
const error = res.error

// Routes
// Create employee contract
router.post('/create', (req, res, next) => {
	var startTime = process.hrtime()
	employee.create()
		.then(result => {
			employee.setInstance(result.contract.address) // Store the address
			var elapsedMilliseconds = toMilliSeconds(process.hrtime(startTime))
			response(res, 200, {address: result.contract.address, transaction: result.receipt, milliSeconds: elapsedMilliseconds})
		})
		.catch(err => error(res, 500, err))
})

// Add employee to contract
router.post('/add', (req, res, next) => {
	var startTime = process.hrtime()
	employee.add(req.body)
		.then(result => {
			var elapsedMilliseconds = toMilliSeconds(process.hrtime(startTime))
			result.milliSeconds = elapsedMilliseconds
			response(res, 200, result)
		})
		.catch(err => error(res, 500, err))
})

// Add multiple employees to contract
router.post('/import', (req, res, next) => {
	var startTime = process.hrtime()
	employee.importEmployees(req.body.employees)
		.then(result => {
			var elapsedMilliseconds = toMilliSeconds(process.hrtime(startTime))
			result.milliSeconds = elapsedMilliseconds
			response(res, 200, result)
		})
		.catch(err => error(res, 500, err))
})

// Increase salary
router.post('/increase-salary', (req, res, next) => {
	var startTime = process.hrtime()
	employee.increaseSalary(req.body.contractAddress)
		.then(result => {
			var elapsedMilliseconds = toMilliSeconds(process.hrtime(startTime))
			result.milliSeconds = elapsedMilliseconds
			response(res, 200, result)
		})
		.catch(err => error(res, 500, err))
})

// Get salary for employee
router.get('/salary/:id', (req, res, next) => {
	employee.getEmployeeSalary(req.params.id)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router
