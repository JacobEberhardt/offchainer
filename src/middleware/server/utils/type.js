// Define functions
/**
 * Check whether the given value is an integer.
 *
 * @param {} value The value to check
 * @returns {Boolean} Whether the given value is an integer
 *
 * @description Also returns true for values of type float with integer values
 */
function isInt(value) {
	let x = parseFloat(value)
	return !isNaN(value) && (x | 0) === x
}

/**
 * Check whether the given value is an integer.
 *
 * @param {} value The value to check
 * @returns {Boolean} Whether the given value is an integer
 *
 * @decription Does return false for values of type float with integer values
 */
function isStrictInt(value) {
	return parseInt(value, 10) === value
}


// Export module
module.exports = {
	isInt,
	isStrictInt
}
