// Import dependencies
const router = require('express').Router()
const financials = require('../../models/financialsOnchain')
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



//add a record entry to DB and compute the record's root Hash
router.post('/addEntry', (req, res, next) => {
	financials.add(req.body)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})


//getRecordingDataRootHash
router.get('/getRecordingDateRootHash/:id', (req, res, next) => {
	financials.getRecordingDateRootHash(req.params.id)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})


// Export module
module.exports = router