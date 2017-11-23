// npm install m-tree
// https://github.com/miguelmota/merkle-tree
// npm install keccak
// https://www.npmjs.com/package/keccak
const MerkleTree = require('m-tree')
const createKeccakHash = require('keccak')
const reverse = require('buffer-reverse')

function keccak(data) {
  // returns Buffer
  return createKeccakHash('keccak256').update(data).digest()
}

const leaves = ['a', 'b', 'c', 'd'].map(x => keccak(x))
console.log('leaves: ' + leaves.map(x => x.toString('hex')))


const tree = new MerkleTree(leaves, keccak)


const tree_leaves = tree.getLeaves()
console.log('leaves in tree: ' + tree_leaves.map(x => x.toString('hex')))


const merkleRoot = tree.getRoot()
console.log('merkleRoot:')
console.log(merkleRoot.toString('hex'))

// leaves[2] specifies which data we want, so the counter value in this leaves-array
// because in the counter-use-case the tree can contain values multiple times, the second argument specifies the index within the leaves-array
const proof = tree.getProof(leaves[2], 2)
console.log('Generated proof:')
console.log(proof)



// Function to verify a proof within JavaScript -> this won't be possible within the SC,
// so we need to find out what the verify()-method does behind the scenes
const verified = tree.verify(proof, leaves[2], merkleRoot)
console.log('verified: ' + verified)


// Essentially, the proof looks like a list of hashes + position information, so following should work:
// we start with leaves[2], our piece of data -> hash it
var leaves_2_hash = keccak(leaves[2])
// proof[0] has position right and its hash, so leaves_2_hash + proof[0] (note the position right of the proof[0] here) -> then hash that
console.log('proof[0]: ' + proof[0].position + ", " + proof[0].data)
var upper_hash = keccak((Buffer.concat([reverse(leaves_2_hash), reverse(proof[0].data)])))

// proof[1] has position left and its hash, so proof[1] + upper_hash (note the position left of the proof[1] here) ->
// then hash that, and we should have the merkle root
console.log('proof[1]: ' + proof[1].position + ", " + proof[1].data)
var merkle_root_hopefully = keccak((Buffer.concat([reverse(proof[1].data), reverse(upper_hash)])))

console.log('merkle_root_hopefully: ' + merkle_root_hopefully.toString('hex'))
