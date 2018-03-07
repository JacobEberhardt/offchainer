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

// Query complete Date
router.get('/query-with-date', (req, res, next) => {
	financials.queryWithDate(req.query)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Get all financials records from DB
router.get('/', (req, res, next) => {
	financials.getAllFinancials()
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

router.get('/check-row-data', (req, res, next) => {
	financials.checkRowData()
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Add a record entry to DB and compute the record's root Hash
router.post('/entry', (req, res, next) => {
	financials.add(req.body)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Get the Record entry by an index
router.get('/record/:id', (req, res, next) => {
	financials.getRecordEntry(req.params.id)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Get root hash
router.get('/root-hash/:id', (req, res, next) => {
	financials.getRootHash(req.params.id)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router
