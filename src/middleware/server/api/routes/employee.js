// Import dependencies
const router = require('express').Router()
const employee = require('../../models/employee')
const db = require('../../models/database')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

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
	employee.add(req.body)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Create employee contract
router.post('/create', (req, res, next) => {
	employee.create(res)
		.then(result => {
			employee.setInstance(result.contract.address) // Store the address
			response(res, 200, {address: result.contract.address, transaction: result.receipt})
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
	employee.increaseSalary(req.body.contractAddress)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})


// Export module
module.exports = router
