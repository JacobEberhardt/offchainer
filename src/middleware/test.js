// npm install m-tree
// npm install keccak
const MerkleTree = require('m-tree')
const createKeccakHash = require('keccak')

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
