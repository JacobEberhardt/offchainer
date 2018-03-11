// Define values
const POLLING_INTERVAL_IN_MILLISECONDS = 500
const TIMEOUT_IN_SECONDS = 30

// Define functions
/**
 * Set the default account for a web3 instance.
 *
 * @param {Web3} instance The given web3 instance
 * @param {Number} index The index of the account to set as the default account
 * @returns {Promise} A promise that depends on the setting of the default account
 */
function setDefaultAccount(instance, index) {

	return new Promise((resolve, reject) => {

		setTimeout(() => reject('Timeout'), TIMEOUT_IN_SECONDS * 1000)

		awaitConnection(instance)
			.then(() => {
				instance.eth.defaultAccount = instance.eth.accounts[index] // Set default account
				resolve()
			})

	})

}

/**
 * Wait until the connection for the given web3 instance is established.
 *
 * @param {Web3} instance The given web3 instance
 * @returns {Promise} A promise which is resolved once the connection is established
 */
function awaitConnection(instance) {
	return new Promise(resolve => {
		let interval = setInterval(function() {
			if (instance.isConnected()) {
				clearInterval(interval)
				resolve()
			}
		}, POLLING_INTERVAL_IN_MILLISECONDS)
	})
}

// Export module
module.exports = {
	setDefaultAccount,
	awaitConnection
}
