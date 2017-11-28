//please refer to this documentation https://github.com/miguelmota/merkle-tree#MerkleTree+getProof
const MerkleTree = require('./merkleTree')
const web3 = require('../config/web3')

// example usesage
var arr = ['a', 'b', 'c', 'd'];
var tree = createTree(createLeaves(arr));
console.log(tree.getLayers())
// console.log(printTree(tree))
// console.log(verify(tree, 1));

// compare keccaking a buffer, and a hex of the buffer. 
// console.log(keccak("a".concat("b")));
// console.log(keccak(Buffer.concat([new Buffer("a"), new Buffer("b")])))


/**
 * Hash(keccak) the data in the array, and returns an array of <Bufffer>, the hashed data. 
 *
 * @param {Object} dataArray An array of the data that will be hashed to construct the merkle tree
 * @returns {Object} An array<Buffer> of the hashed data. 
 */
function createLeaves(dataArray) {
	return dataArray.map(data => sha3(data))
}

/**
 * Return a merkle tree
 *
 * @param {Object} leaves An array of <Buffer>, the hashed data to be used to construct the merkle tree
 * @returns {Object} The Merkle Tree object. 
 */
function createTree(leaves) {
	return new MerkleTree(leaves, sha3)
}

/**
 * Return the root hash of the merkle tree
 *
 * @param {Object} tree A Merkle Tree object
 * @returns {Object} returns a <Buffer> type object, the root hash itself. 
 */
function getRoot(tree) {
	return tree.getRoot()
}

/**
 * Prints out the tree by layers. 
 *
 * @param {Object} tree A Merkle Tree object
 */
function printTree(tree) {
	const treeLayers = tree.getLayers()
	for(var i = 0; i < treeLayers.length; i ++) {
		console.log("Height " + i)
		console.log(treeLayers[i])
	}
}

/**
 * Return the proof or the minimum data required to recreate the merkle tree based on the target leaf. 
 *
 * @param {Object} tree A Merkle Tree object
 * @param {Number} index The index of the leaves that wants to be used as a target starting from 0.
 * @returns {Object} returns a Buffer array of the minimum data needed to recreate the merkle tree. 
 */
function getProof(tree, leaf, index) { 
	return tree.getProof(tree.getLeaves()[leaf], index)
}

// this will later be a SC function
function verify(tree, target) {
	// This is how to verify the proof.
	const proof = tree.getProof(tree.getLeaves()[target], target)
	var arr = []
	var newHash
	arr.push(tree.getLeaves()[target].toString('hex')) // push the target
	// if you don't believe it, uncomment below, and comment ^ up 
	// arr.push(keccak('xx')); // target is compromised
	for(var i = 0; i < proof.length; i++) {
		arr.push(proof[i].data.toString('hex'))
		if(proof[i].position === "left"){ // swap the first first element and the second element. So that the 
			var temp = arr[0]
			arr[0] = arr[1]
			arr[1] = temp
		} 
		// concat my own buffer Array.
		// var arr1 = [];
		// for(var j = 0; j < 64; j++) {
		// 	if(j < 32) {
		// 		arr1.push(arr[0][j])
		// 	} else {
		// 		arr1.push(arr[1][j - 32])
		// 	}
		// }

		newHash = sha3(arr[0] + arr[1])
		// newHash = keccak(new Buffer(arr1)) 
		arr = []
		arr[0] = newHash
	}
	console.log(newHash)
	console.log(tree.getRoot())
	return newHash === tree.getRoot()
}

///// PRIVATE FUNCTION /////
/**
 * Return the hashed (keccak) data
 *
 * @param {Generic?} data The data that is needed to be hashed
 * @returns {Object} returns a Buffer type object that represents the hashed data.
 */
function sha3(data) {
  // returns Hex 0x123etcetc
  return web3.sha3(data, {encoding: 'hex'})
}

module.exports = {
	createLeaves,
	createTree,
	getRoot,
	printTree,
	getProof,
	verify
}




