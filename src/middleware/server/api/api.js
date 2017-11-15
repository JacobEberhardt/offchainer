// Import dependencies
const router = require('express').Router()

// Response functions
function response(res, status, text) {
	var obj = {status: status}
	if (text) obj.text = text
	res.writeHead(status, {'Content-Type': 'application/json'})
	res.write(JSON.stringify(obj))
	res.end()
}

function error(res, status, err) {
	console.log(err)
	response(res, status)
}

// Routes

// 404 fallback
router.get('/*', (req, res, next) => {
	error(res, 404)
})

module.exports = router
