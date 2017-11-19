// Define values
const TIMEOUT_IN_SECONDS = 5

// Define functions
/**
 * Return a promise for a callback function.
 *
 * @param {Function} originalFunction A function which accepts a callback
 * @param {Object} obj An object containing an optional argument for the function to promisify and a required property of the returned object
 * @returns {Promise} A promise that depends on the execution of the original function
 */
function promisify(originalFunction, obj) {

	var arg, requiredProperty
	if (obj.hasOwnProperty('arg')) arg = obj.arg // Check for an argument to feed to the original function
	if (obj.hasOwnProperty('requiredProperty')) { // Check for a required property of the returned object
		requiredProperty = obj.requiredProperty
		if (typeof(requiredProperty) !== 'string') throw new TypeError('Attribute "requiredProperty" has to be of type "string".') // Check type of the required property name
	}

	return new Promise(function (resolve, reject) {
		setTimeout(function (){reject('Timeout')}, TIMEOUT_IN_SECONDS * 1000) // Reject after timeout
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
			if (arg !== undefined) originalFunction(arg, callback) // Run the original function with argument
			else originalFunction(callback) // Run the original function
		}
		catch (err) {
			reject(err) // Reject if the execution of the original function fails
		}
	})

}

// Export module
module.exports = promisify
