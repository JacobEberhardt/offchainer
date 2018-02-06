// Import dependencies
const router = require('express').Router()
const employee = require('../../models/employee')
const db = require('../../models/database')
const res = require('../../utils/response')
const toMilliSeconds = require('../../utils/hrtime_utils')

// Set response functions
const response = res.response
const error = res.error

var debug = true

// Define routes
// Get all employees from database
router.get('/', (req, res, next) => {
	employee.getAll()
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Get single employee from database
router.get('/:id/root-hash', (req, res, next) => {
	employee.getRootHash(req.params.id)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Add employee to contract
router.post('/add', (req, res, next) => {
	if(debug) console.time("employee-add")
	var startTime = process.hrtime()
	employee.add(req.body)
		.then(result => {
			if(debug) console.timeEnd("employee-add")
			var elapsedMilliseconds = toMilliSeconds(process.hrtime(startTime))
			result.milliSeconds = elapsedMilliseconds
			response(res, 200, result)
		})
		.catch(err => error(res, 500, err))
})

// Create employee contract
router.post('/create', (req, res, next) => {
	var startTime = process.hrtime()
	employee.create(res)
		.then(result => {
			employee.setInstance(result.contract.address) // Store the address
			var elapsedMilliseconds = toMilliSeconds(process.hrtime(startTime))
    	if(debug) console.log('functionWantToMeasure takes ' + elapsedMilliseconds + 'seconds')
			response(res, 200, {address: result.contract.address, transaction: result.receipt, milliSeconds: elapsedMilliseconds})
		})
		.catch(err => error(res, 500, err))
})

// Add multiple employees to contract
router.post('/import', (req, res, next) => {
	employee.importEmployees(req.body.employees)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Increase salary
router.post('/increase-salary', (req, res, next) => {
	var startTime = process.hrtime()
	employee.increaseSalary(req.body.contractAddress)
		.then(result => {
			console.log("result")
			console.log(result)
			var elapsedMilliseconds = toMilliSeconds(process.hrtime(startTime))
			result.push({'milliSeconds': elapsedMilliseconds})
			response(res, 200, result)
		})
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router
