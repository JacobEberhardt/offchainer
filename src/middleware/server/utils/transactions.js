// Define values
const TIMEOUT_IN_SECONDS = 30

// Define functions
function waitForBlock(instance, hash) {

	const filter = instance.eth.filter({fromBlock: 1, toBlock: 'latest'})

	return new Promise((resolve, reject) => {

		// Set timeout
		setTimeout(() => reject('Timeout'), TIMEOUT_IN_SECONDS * 1000)

		// Watch for transactions
		filter.watch((error, blockHash) => {
			if (error) reject(error)

			const block = instance.eth.getBlock(blockHash.blockHash, true)
			block.transactions.forEach(transaction => {
				if (transaction.hash === hash) {
					filter.stopWatching()
					resolve()
				}
			}) 
		})

	})

}

// Export module
module.exports = {
	waitForBlock
}
