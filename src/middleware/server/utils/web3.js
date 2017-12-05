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

		let interval = setInterval(function() {
			if (instance.isConnected()) {
				instance.eth.defaultAccount = instance.eth.accounts[index] // Set default account
				clearInterval(interval)
				resolve()
			}
		}, POLLING_INTERVAL_IN_MILLISECONDS)

	})

}

// Export module
module.exports = {
	setDefaultAccount
}
