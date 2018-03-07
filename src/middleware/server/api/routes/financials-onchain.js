// Import dependencies
const router = require('express').Router()
const financials = require('../../models/financials-onchain')
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

// Add a record entry to DB and compute the record's root Hash
router.post('/entry', (req, res, next) => {
	financials.add(req.body)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Get root hash for recording date
router.get('/recording-date/:id', (req, res, next) => {
	financials.getRecordingDate(req.params.id)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Export module
module.exports = router
