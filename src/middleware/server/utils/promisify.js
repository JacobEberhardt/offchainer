// Define values
const TIMEOUT_IN_SECONDS = 60

// Define functions
/**
 * Return a promise for a callback function.
 *
 * @param {Function} originalFunction A function which accepts a callback
 * @returns {Function} The promisified function
 */
function promisify(originalFunction) {

	/**
	 * The promisified function
	 *
	 * @param {Object} obj An object that holds arguments and additional information for the original function
	 * @returns {Promise} A promise that depends on the execution of the original function
	 */
	return function (obj) {

		var args, requiredProperty, context
		if (obj.hasOwnProperty('args')) args = obj.args // Check for an argument to feed to the original function
		if (obj.hasOwnProperty('requiredProperty')) { // Check for a required property of the returned object
			requiredProperty = obj.requiredProperty
			if (typeof(requiredProperty) !== 'string') throw new TypeError('Attribute "requiredProperty" has to be of type "string".') // Check type of the required property name
		}
		context = obj.hasOwnProperty('context') ? obj.context : null // Set context for original function

		return new Promise(function (resolve, reject) {
			setTimeout(function () {reject('Timeout')}, TIMEOUT_IN_SECONDS * 1000) // Reject after timeout
			/**
			 * The callback for the original function.
			 *
			 * @param {Object} err An optional error object
			 * @param {Object} result The returned object
			 */
			const callback = function (err, result) {
				if (err) reject(err) // Reject if there is an error
				if (result !== undefined) { // Wait for a result, don't reject because the callback function might be called multiple times
					if (requiredProperty != undefined) {
						if (result.hasOwnProperty(requiredProperty) && result[requiredProperty] != undefined) resolve(result) // If a specific property is required, only resolve if the property exists
					}
					else resolve(result) // Resolve if there is a result and no required property
				}
			}
			try {
				if (args !== undefined) {
					if (args.constructor !== Array) args = [args] // Convert to array if there's only a single argument
				}
				else {
					args = [] // Initialize empty args array
				}
				args.push(callback) // Push the callback function to arguments array
				originalFunction.apply(context, args) // Call the function with defined context and arguments
			}
			catch (err) {
				reject(err) // Reject if the execution of the original function fails
			}
		})
	}

}

// Export module
module.exports = promisify
