// Import dependencies
const promisify = require('./promisify')

// Define functions
function watch(event) {
	var eventInstance = event()
	return promisify(eventInstance.watch)({context: eventInstance})
		.then(result => {
			eventInstance.stopWatching()
			return result
		})
}

// Export module
module.exports = {
	watch
}
