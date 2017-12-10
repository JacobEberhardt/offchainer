// Import dependencies
const type = require('./type')

// Define values
const DEFAULT_CACHE = false

// Map functions to be able to easily remove dependencies if necessary 
const isInt = type.isInt

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
		this.constructed = false
		this._constructTree()

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
		return this.constructed ? this.tree[0] : this._constructTree()
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
	/**
	 * Get the overall number of nodes in the tree for the given number of leaf nodes
	 *
	 * @param {Number} numberOfLeaves The given number of leaf nodes
	 * @returns {Number} The overall number of nodes in the tree
	 */
	_getNumberOfNodes(numberOfLeaves) {
		let height = Math.ceil(Math.log(numberOfLeaves) / Math.log(2))
		let numberOfNodesWithoutLastLevel = parseInt(new Array(height).join('1'), 2) // This creates a string of (height - 1) times '1' and parses that as a binary number, effectively giving the overall number of nodes without those on the last level
		let numberOfNodesOnBeforeLastLevel = Math.pow(2, height - 2)
		return numberOfNodesWithoutLastLevel + 2 * (numberOfLeaves - numberOfNodesOnBeforeLastLevel) 
	}

	/**
	 * Get the index of the parent node for the node with the given index
	 *
	 * @param {Number} index The given index
	 * @returns {Number} The index of the parent node
	 */
	_parent(index) { 
		if (index === 0) return null
		return (index - 1) >> 1 
	}

	/**
	 * Get the index of the left child node for the node with the given index
	 *
	 * @param {Number} index The given index
	 * @returns {Number} The index of the left child node
	 */
	_leftChild(index) {
		let childIndex = index * 2 + 1
		return childIndex > this.tree.length - 1 ? null : childIndex
	}

	/**
	 * Get the index of the right child node for the node with the given index
	 *
	 * @param {Number} index The given index
	 * @returns {Number} The index of the right child node
	 */
	_rightChild(index) {
		let childIndex = index * 2 + 2
		return childIndex > this.tree.length - 1 ? null : childIndex
	}

	/**
	 * Concat an array of hash strings with '0x' prefix to one string with '0x' prefix
	 *
	 * @param {Array] array The array of hash string to concatenate
	 * @returns {String} The resulting concatenated hash string
	 */
	_concatHashes(array) {
		let removePrefix = string => string.indexOf('0x') === 0 ? string.substring(2) : string
		let string = array.map(removePrefix).join('')
		return '0x'.concat(string)
	}

	/**
	 * Compute the hash for the node with the given index
	 *
	 * @param {Number} index The given index
	 * @returns {String} The resulting hash
	 */
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

	/**
	 * Compute the hashes to construct a Merkle tree
	 *
	 * @returns {String} The Merkle root of the constructed tree
	 */
	_constructTree() {
		let numberOfNonLeaveNodes = this._getNumberOfNodes(this.leaves.length) - this.leaves.length
		this.tree = new Array(numberOfNonLeaveNodes).fill(null).concat(this.leaves.map(this.hashFunction))
		this._computeHash(0) // This computes all hashes in the tree recursively, starting from the root
		this.constructed = true
		return this.tree[0]
	}

	/**
	 * Create a proof for the given array of indices
	 *
	 * @param {Array} indices The array of indices to create the proof for
	 * @returns {Object} The generated proof
	 */
	_createProof(indices) {

		// Construct tree if necessary
		if (!this.constructed) this._constructTree()
		
		// Check arguments
		indices = isInt(indices) ? [indices] : indices

		// Declare variables
		let proof = {}
		let hashes = [],
			values = []
		let checks = new Array(this.tree.length).fill(false)
		let indexOfFirstLeaf = this.tree.length - this.leaves.length

		// Define functions
		let needsComputation = index => {
			index += indexOfFirstLeaf // Translate leaf index to tree array index
			checks[index] = true
			while ((index = this._parent(index)) !== null) { // Set the parent of a node that requires computation to require computation as well, recursively
				if (checks[index] === true) break
				checks[index] = true
			}
		}

		let addHashes = index => { // Add the hashes in-order, recursively
			if (index === null) return;
			if (checks[index]) { // Here is the in-order (first the left subtree, then right one)
				addHashes(this._leftChild(index))
				addHashes(this._rightChild(index))
			}
			else {
				hashes.push(this.tree[index])
			}
		}

		let addLeave = index => values.push(this.leaves[index])

		// Determine which hashes need to be computed
		indices.forEach(needsComputation)
		proof.checks = checks

		// Determine the hashes which are given with the proof
		addHashes(0) // This adds all hashed required for the proof recursively, starting from the root
		proof.hashes = hashes
		
		// Include the leaves for the proof
		indices.forEach(addLeave)
		proof.values = values

		return proof

	}

}

// Export module
module.exports = MerkleTree
