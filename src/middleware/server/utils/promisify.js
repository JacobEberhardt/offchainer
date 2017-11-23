// Define values
const TIMEOUT_IN_SECONDS = 5

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

		var args, requiredProperty
		if (obj.hasOwnProperty('args')) args = obj.args // Check for an argument to feed to the original function
		if (obj.hasOwnProperty('requiredProperty')) { // Check for a required property of the returned object
			requiredProperty = obj.requiredProperty
			if (typeof(requiredProperty) !== 'string') throw new TypeError('Attribute "requiredProperty" has to be of type "string".') // Check type of the required property name
		}

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
					if (requiredProperty !== undefined) {
						if (result.hasOwnProperty(requiredProperty)) resolve(result) // If a specific property is required, only resolve if the property exists
					}
					else resolve(result) // Resolve if there is a result and no required property
				}
			}
			try {
				if (args !== undefined) {
					if (args.constructor === Array) {
						args.push(callback)
						originalFunction.apply(null, args) // Call the function with multiple arguments if arg is an array
					}
					else originalFunction(args, callback) // Run the original function with argument
				}
				else originalFunction(callback) // Run the original function
			}
			catch (err) {
				reject(err) // Reject if the execution of the original function fails
			}
		})
	}

}

// Export module
module.exports = promisify
