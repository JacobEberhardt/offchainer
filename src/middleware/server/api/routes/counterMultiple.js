// Import dependencies
const router = require('express').Router()
const counterMultiple = require('../../models/counterMultiple')
const db = require('../../models/database')
const res = require('../../utils/response')

// Set response functions
const response = res.response
const error = res.error

// Routes
/**
 * Create a new counter contract.
 */
router.post('/create', (req, res, next) => {
	counterMultiple.create(res)
		.then(contract => {
			counterMultiple.setInstance(contract.address) // Store the address
			response(res, 200, {address: contract.address})
		})
		.catch(err => error(res, 500, err))
})

// Add counter to contract
router.post('/add', (req, res, next) => {
	counterMultiple.add(req.body)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Get all Counters from DB
router.get('/', (req, res, next) => {
	counterMultiple.getAllFromDb()
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

// Get all Employees from DB
router.get('/:id', (req, res, next) => {
	counterMultiple.getRootHashFromSc(req.params.id)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})

router.post('/:id/increase/:col', (req, res, next) => {
	var col
	const badRequest = () => response(res, 400, 'Invalid index.')
	try {
		col = parseInt(req.params.col)
	}
	catch (err) {
		badRequest()
	}
	if (typeof(col) !== 'number' ||col < 0 || col > 4) return badRequest()
	counterMultiple.increaseSingle(req.params.id, col)
		.then(result => response(res, 200, result))
		.catch(err => error(res, 500, err))
})


// Export module
module.exports = router

