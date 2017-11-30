// Import dependencies
const router = require('express').Router()
const financials = require('../../models/financials')
const db = require('../../models/database')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

// Routes

// Create Financials contract
router.post('/create', (req, res, next) => {
	financials.create(res)
		.then(contract => {
			financials.setInstance(contract.address) // Store the address
			response(res, 200, {address: contract.address})
		})
		.catch(err => error(res, 500, err))
})

// Add a record to contract
router.post('/new', (req, res, next) => {
	financials.add(req.body)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})
// Get all financials records from DB
router.get('/', (req, res, next) => {
	financials.getAllFinancials()
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})
/*
// Add multiple financial records to contract
router.post('/more', (req, res, next) => {
	financials.importFinancials(req.body.financials)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})*/


// Export module
module.exports = router

