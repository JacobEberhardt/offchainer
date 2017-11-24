const MerkleTree = require('m-tree')
const createKeccakHash = require('keccak')

// tests
var arr = ['a', 'b', 'c', 'd'];
var tree = createTree(createLeaves(arr));
// printTree(tree);
console.log(verify(tree, 2));

function createLeaves(dataArray) {
	return dataArray.map(data => keccak(data));
}

function createTree(leaves) {
	return new MerkleTree(leaves, keccak);
}

function getRoot(tree) {
	return tree.getRoot();
}

function printTree(tree) {
	var treeLayers = tree.getLayers()
	for(var i = 0; i < treeLayers.length; i ++) {
		console.log("Height " + i)
		console.log(treeLayers[i]);
	}
}

// Param is the index of the counter
function getProof(tree, index) { 
	return tree.getProof(tree.getLeaves()[index]);
}

// this will later be a SC function
function verify(tree, target) {
	// This is how to verify the proof.
	var proof = getProof(tree, target);
	var arr = [];
	var rootHash;
	arr.push(tree.getLeaves()[target]); // push the target
	// if you don't believe it, uncomment below, and comment ^ up 
	// arr.push(keccak('xx')); // target is compromised
	for(var i = 0; i < proof.length; i++) {
		arr.push(proof[i].data);
		if(proof[i].position === "left"){ // swap the first first element and the second element. So that the 
			var temp = arr[0];
			arr[0] = arr[1];
			arr[1] = temp;
		} 
		var newHash = keccak(Buffer.concat(arr));
		
		if(i !== proof.length - 1) {
			arr = [];
			arr[0] = newHash;
		} else {
			rootHash = newHash;
		}
	}
	return rootHash.equals(tree.getRoot());
}

// private function
function keccak(data) {
  // returns Buffer
  return createKeccakHash('keccak256').update(data).digest()
}




