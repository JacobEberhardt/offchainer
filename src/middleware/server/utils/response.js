/**
 * Send a JSON response.
 *
 * @param {Object} res The response object
 * @param {Number} status The status code for the response
 * @param {Object} content A JSON object which contains any additional data
 */
function response(res, status, content) {
	var obj = {status: status}
	if (content) obj.content = content
	res.writeHead(status, {'Content-Type': 'application/json'})
	res.write(JSON.stringify(obj))
	res.end()
}

/**
 * Send an error response.
 *
 * @param {Object} res The response object
 * @param {Number} status The status code for the response
 * @param {String} err An error message which gets logged
 */
function error(res, status, err) {
	console.error(typeof(err) === 'object' && err.hasOwnProperty('stack') ? err.stack : err)
	response(res, status)
}

// Export module
module.exports = {
	response,
	error
}
