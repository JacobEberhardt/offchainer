// Define values
const DEFAULT_CACHE = false

// Define class
/**
 * An implementation of a Merkle tree
 *
 * @namespace MerkleTree
 */
class MerkleTree {
	
	// Define public functions
	/**
	 * Create a new instance
	 *
	 * @param {Array} leaves An array which contains the leave elements
	 * @param {Function} hashFunction A the function which is used for hashing
	 * @returns {MerkleTree} The new instance
	 */
	constructor(leaves, hashFunction, options = {}) {
		// Check argument types
		if (leaves.constructor.name !== 'Array') throw Error('First argument must be an array')
		if (typeof hashFunction !== 'function') throw Error('Second argument must be a function')
		if (typeof options !== 'object') throw Error('Third argument must be an object')

		// Set variables
		this.leaves = leaves
		this.hashFunction = hashFunction
		this.tree = this._constructTree()

		// Set options
		this.cache = options.hasOwnProperty('cache') ? !!options.cache : DEFAULT_CACHE

		// Return instance
		return this
	}

	/**
	 * Get the root hash of the Merkle tree
	 *
	 * @returns {String} The root hash of the Merkle tree
	 */
	getRoot() {
		return this.tree[0]
	}

	/**
	 * Get a proof for the given indices
	 *
	 * @param {Array} indices An array which holds the indices to get the proof for
	 * @returns {Object} The proof
	 */
	getProof(indices) {
		if (this.cache) {
			let key = indices.map(x => x.toString()).join()	
			return this.proof[key] ? this.proof[key] : this.proof[key] = this._createProof(indices)
		}
		else {
			return this._createProof(indices)
		}
	}
	
	// Define pseudo-private functions
	_getNumberOfNodes(numberOfLeaves) {
		let height = Math.ceil(Math.log(numberOfLeaves) / Math.log(2))
		let numberOfNodesWithoutLastLevel = parseInt(new Array(height).join('1'), 2) // This creates a string of (height - 1) times '1' and parses that as a binary number, effectively giving the overall number of nodes without those on the last level
		let numberOfNodesOnBeforeLastLevel = Math.pow(2, height - 2)
		return numberOfNodesWithoutLastLevel + 2 * (numberOfLeaves - numberOfNodesOnBeforeLastLevel) 
	}

	_parent(index) { 
		if (index === 0) return null
		return (index - 1) >> 1 
	}

	_leftChild(index) {
		let childIndex = index * 2 + 1
		return childIndex > this.tree.length - 1 ? null : childIndex
	}

	_rightChild(index) {
		let childIndex = index * 2 + 2
		return childIndex > this.tree.length - 1 ? null : childIndex
	}

	_concatHashes(array) {
		let removePrefix = string => string.indexOf('0x') === 0 ? string.substring(2) : string
		let string = array.map(removePrefix).join('')
		return '0x'.concat(string)
	}

	_computeHash(index) {
		if (this.tree[index] === null) {
			let leftHash = this._computeHash(this._leftChild(index))
			let rightHash = this._computeHash(this._rightChild(index))
			return this.tree[index] = this.hashFunction(this._concatHashes([leftHash, rightHash]))
		}
		else {
			return this.tree[index]
		}
	}

	_constructTree() {
		let numberOfNonLeaveNodes = this._getNumberOfNodes(this.leaves.length) - this.leaves.length
		this.tree = new Array(numberOfNonLeaveNodes).fill(null).concat(this.leaves.map(this.hashFunction))
		let root = this._computeHash(0)
		return this.tree
	}

	_createProof(indices) {
		
		let proof = {}
		let indexOfFirstLeaf = this.tree.length - this.leaves.length

		// Determine which hashes need to be computed
		let checks = new Array(this.tree.length).fill(false)
		indices.forEach(index => {
			index += indexOfFirstLeaf
			checks[index] = true
			while ((index = this._parent(index)) !== null) {
				if (checks[index] === true) break
				checks[index] = true
			}
		})
		proof.checks = checks

		// Determine the hashes which are given with the proof
		let hashes = []
		let addHashes = index => {
			if (index === null) return;
			if (checks[index]) {
				addHashes(this._leftChild(index))
				addHashes(this._rightChild(index))
			}
			else {
				hashes.push(this.tree[index])
			}
		}
		addHashes(0)
		proof.hashes = hashes
		
		// Include the leaves for the proof
		let values = []
		indices.forEach(index => {
			values.push(this.leaves[index])
		})
		proof.values = values

		return proof

	}

}

// Export module
module.exports = MerkleTree
