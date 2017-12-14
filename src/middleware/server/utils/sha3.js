// Import dependencies
const soliditySha3 = require('web3-utils').soliditySha3
const type = require('./type.js')

// Define functions
/**
 * Throw a TypeError for unknown type.
 *
 * @param {} value The value whose type cannot be handled
 * @trows {TypeError} Throws a TypeError in every case
 */
function throwBadType(value) {
	throw TypeError('Cannot handle type "' + typeof(value) + '"')
}

/**
 * Compute the SHA3 hash for the given value.
 *
 * @param {} value The value to compute the hash for
 * @returns {String} The resulting hash
 */
function customSha3(value) {

	// Call soliditySha3 depending on the type of the given value
	switch (typeof(value)) {

		case 'string':
			return soliditySha3(value)

		case 'number':
			if (type.isStrictInt(value)) return soliditySha3({value: value.toString()})

		default:
			throwBadType(value)

	}

}

// Export module
module.exports = customSha3
