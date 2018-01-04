// Test Class. 

const MerkleTree = require('../utils/merkleTree')
const sha3 = require('web3-utils').soliditySha3

var numOfSuccess = 0
var totalTest = 0
var numOfFailures = 0

const leaves1 = [0, 0, 0 ,0] // normal
const leaves2 = [0, 1, 2, 3] // different data
const leaves3 = [0, 1, 2, 3, 4] //odd number of leaves
const leaves4 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // mid size odd number 
const leaves5 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] // a bigger tree
const leaves6 = [0, "a", 2, "b", 4, "asd", 6, 7, 8, 9, 10, "Asd", 12, 13, 14, "ASD"] // another tree with more than one data type

function verify(leaves, index, testName, intentToFail) { // index is array
	var hashes = []
	for(var i = 0; i < leaves.length; i++) {
		if(typeof leaves[i] === "number") {
			hashes.push(sha3({value: leaves[i].toString(), type: 'uint8'}))
		} else {
			hashes.push(sha3({value: leaves[i], type: 'string'}))
		}
	}
	var tree = new MerkleTree(hashes, sha3, {hashLeaves: false, values: leaves})
	const root = tree.getRoot()
	if(intentToFail) {
		if(index[0] !== 0) {
			hashes[index[0] - 1] = "0x99" // Will cause it to fail 
		} else {
			hashes[index[0] + 1] = "0x99" // Will cause it to fail 
		}
		tree = new MerkleTree(hashes, sha3, {hashLeaves: false, values: leaves})
	}
	const proof = tree.getProof(index)
	totalTest += 1
	const _rootHash = recreateTree(tree, proof) // the recreated roothash. I am sending the tree, just to make sure I use the same hash function
	const conditionCheck = _rootHash === root ? (intentToFail ? false : true) : false || intentToFail
	if(conditionCheck) {
		console.log(testName + " : " + "SUCCESS")
		numOfSuccess += 1
	} else {
		console.log(testName + " : " + "FAILED")
		console.log("Trusted Roothash: " + root)
		console.log("Computed RootHash: " + _rootHash)
		numOfFailures += 1
	}
}

function recreateTree(tree, proof) {
	const _rootHash = computeHash(	
		tree,	
		0, 
		proof.checks, 
		proof.indexOfFirstLeaf, 
		proof.hashes, 
		proof.values
	)

	return _rootHash 
}

function computeHash(tree, index, checks, indexOfFirstLeaf, hashes, values) {
	if(!checks[index]) { //if branches/leaves do need to be computed
		return hashes[index]
	}

	if(index >= indexOfFirstLeaf) { // if it is a leaf
		if(typeof values[index] === "number") {
			return sha3({value: values[index].toString(), type: 'uint8'})
		} else {
			return sha3({value: values[index], type: 'string'})
		}
	}

	return sha3(tree._concatHashes([
			computeHash(tree, index * 2 + 1, checks, indexOfFirstLeaf, hashes, values),
			computeHash(tree, index * 2 + 2, checks, indexOfFirstLeaf, hashes, values)
		]))
}

// MAIN TEST CASES

/////// SINGLE ITEM ////////////
// normal case
verify(leaves1, 0, "Normal test target index 0", false)
verify(leaves1, 1, "Normal test target index 1", false)
verify(leaves1, 2, "Normal test target index 2", false)
verify(leaves1, 3, "Normal test target index 3", false)

// leaves with different data 
// single item proof
verify(leaves2, 0, "different data target index 0", false)
verify(leaves2, 1, "different data target index 1", false)
verify(leaves2, 2, "different data target index 2", false)
verify(leaves2, 3, "different data target index 3", false)

// odd number of leaves
// still singe item
verify(leaves3, 0, "odd number data target index 0", false)
verify(leaves3, 1, "odd number data target index 2", false)
verify(leaves3, 2, "odd number data target index 3", false)
verify(leaves3, 3, "odd number data target index 4", false)

// medium number of leaves odd size
// still singe item
for(var i = 0; i < leaves4.length; i++) {
	verify(leaves4, i, "meidum odd size data target index" + i, false)
}

// bigger number of leaves
// still singe item
for(var i = 0; i < leaves5.length; i++) {
	verify(leaves5, i, "bigger size data target index" + i, false)
}

/////// MULTIPLE ITEM ////////////

// with medium odd number of leaves (2 proofs)
verify(leaves4, [3, 7], "medium odd size data target index 3 and 7", false)
verify(leaves4, [0, 9], "medium odd size data target indexes of both end", false)
verify(leaves4, [8, 9], "medium odd size data target for last 2 index", false)
verify(leaves4, [8, 9, 5], "medium odd size data target last 2 index, and another target", false)

for(var i = 0; i < leaves4.length; i++) {
	verify(leaves4, Array(i + 1).fill().map((e, x) => x), "medium odd size data with " + (i + 1) + " targets", false)
}

for(var i = 0; i < leaves5.length; i++) {
	verify(leaves5, Array(i + 1).fill().map((e, x) => x), "Bigger tree size data with " + (i + 1) + " targets", false)
}

// Testing proof positions, not fixed to three proofs only, but they include such positions.
verify(leaves4, [4, 6, 10], "medium odd size data target with LLL", false)
verify(leaves4, [3, 5, 7], "medium odd size data target with RRR", false)
verify(leaves4, [6, 8, 10], "medium odd size data target with LLR", false)
verify(leaves4, [6], "medium odd size data target with LRR", false) // This is also testing for strict int
verify(leaves4, [3, 6, 8], "medium odd size data target with RLL", false)
verify(leaves4, [3, 5, 2], "medium odd size data target with RRL", false)
verify(leaves4, [6, 9, 0], "medium odd size data target with LRL", false)
verify(leaves4, [3, 10, 1], "medium odd size data target with RLR", false)

// verify data with int and string
verify(leaves6, [2], "Medium size data with int and string, target index 2 = int", false)
verify(leaves6, [1], "Medium size data with int and string, target index 1 = string", false)
for(var i = 0; i < leaves6.length; i++) {
	verify(leaves6, Array(i + 1).fill().map((e, x) => x), "Medium tree size mixed type data with " + (i + 1) + " targets", false)
}

// verify when the merkle tree detects a failed integrity check
verify(leaves2, [1], "intentionally fails integrity check", true)


// report
console.log()
console.log(numOfSuccess + "/" + totalTest + " success")
console.log(numOfFailures + "/" + totalTest + " failed")


