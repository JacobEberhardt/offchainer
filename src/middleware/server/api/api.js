// Import dependencies
const router = require('express').Router()
const offchainer = require('../models/offchainer')

/**
 * Send a JSON response.
 * @param {Object} res The response object
 * @param {Number} status The status code for the response
 * @param {Object} text A JSON object which contains any additional data
 */
function response(res, status, text) {
	var obj = {status: status}
	if (text) obj.text = text
	res.writeHead(status, {'Content-Type': 'application/json'})
	res.write(JSON.stringify(obj))
	res.end()
}

/**
 * Send an error response.
 * @param {Object} res The response object
 * @param {Number} status The status code for the response
 * @param {String} err An error message which gets logged
 */
function error(res, status, err) {
	console.log(err)
	response(res, status)
}

// Routes
router.post('/create', (req, res, next) => {
	offchainer.create(res)
		.then(contract => {
			response(res, 200, {address: contract.address})
		})
		.catch(err => {
			error(res, 500, err)
		})
})

// 404 fallback
router.get('/*', (req, res, next) => {
	error(res, 404)
})

module.exports = router
