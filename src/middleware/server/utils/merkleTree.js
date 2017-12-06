// Define class
/**
 * A simple implementation of a merkle tree
 *
 * @namespace MerkleTree
 */
class MerkleTree {
	/**
	 * Create a new instance
	 *
	 * @param {Array} leaves An array which contains the leave elements
	 * @param {Function} hashFunction A the function which is used for hashing
	 * @returns {MerkleTree} The new instance
	 */
	constructor(leaves, hashFunction) {
		this.leaves = leaves
		this.hashFunction = hashFunction
		return this
	}

	/**
	 * Create the merkle root from the stored leaves
	 *
	 * @returns {String} The merkle root
	 */
	createRoot() {
		return
	}

	createProof() {
		return
	}

	getRoot() {
		return this.root ? this.root: this.root = this.createRoot()
	}

	getProof(indices) {
		return this.proof ? this.proof : this.proof = this.createProof()
	}
}

// Export module
module.exports = MerkleTree
