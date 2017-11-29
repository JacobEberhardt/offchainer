// Import dependencies
const router = require('express').Router()
const employee = require('../../models/employee')
const db = require('../../models/database')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

// Routes

// Create Employee contract
router.post('/create', (req, res, next) => {
	employee.create(res)
		.then(contract => {
			employee.setInstance(contract.address) // Store the address
			response(res, 200, {address: contract.address})
		})
		.catch(err => error(res, 500, err))
})

// Add Employee to contract
router.post('/add', (req, res, next) => {
	employee.add(req.body)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})
// Get all Employees from DB
router.get('/', (req, res, next) => {
	employee.getAll()
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Add multiple Employees to contract
router.post('/import', (req, res, next) => {
	employee.importEmployees(req.body.employees)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Increase Salary
router.post('/increase-salary', (req, res, next) => {
	employee.increaseSalary()
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router

