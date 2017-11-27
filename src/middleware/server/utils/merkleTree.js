//please refer to this documentation https://github.com/miguelmota/merkle-tree#MerkleTree+getProof

/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
class MerkleTree {
  /**
   * @desc Constructs a Merkle Tree.
   * All nodes and leaves are stored as Strings.
   * Lonely leaf nodes are promoted to the next level up without being hashed again.
   * @param {HexString[]} leaves - Array of hashed leaves. Each leaf must be a HexString(hashed).
   * @param {Function} hashAlgorithm - Algorithm used for hashing leaves and nodes
   * @param {Object} options - Additional options
   * @example
   * const MerkleTree = require('m-tree')
   * const crypto = require('crypto')
   *
   * function sha256(data) {
   *   // returns HexString
   *   return crypto.createHash('sha256').update(data).digest()
   * }
   *
   * const leaves = ['a', 'b', 'c'].map(x => sha3(x))
   *
   * const tree = new MerkleTree(leaves, sha256)
   */
  constructor(leaves, hashAlgorithm, options={}) {
    this.hashAlgo = hashAlgorithm
    this.leaves = leaves
    this.layers = [leaves]

    this.createHashes(this.leaves)
  }

  createHashes(nodes) {
    if (nodes.length === 1) {
      return false
    }

    const layerIndex = this.layers.length

    this.layers.push([])

    for (let i = 0; i < nodes.length - 1; i += 2) {
      const left = nodes[i]
      const right = nodes[i+1]
      let data = null

      data = left + right
      let hash = this.hashAlgo(data)
      this.layers[layerIndex].push(hash)
    }

    // is odd number of nodes
    if (nodes.length % 2 === 1) {
      let data = nodes[nodes.length-1]
      let hash = data

      this.layers[layerIndex].push(hash)
    }

    this.createHashes(this.layers[layerIndex])
  }

  /**
   * getLeaves
   * @desc Returns array of leaves of Merkle Tree.
   * @return {HexString[]}
   * @example
   * const leaves = tree.getLeaves()
   */
  getLeaves() {
    return this.leaves
  }

  /**
   * getLayers
   * @desc Returns array of all layers of Merkle Tree, including leaves and root.
   * @return {HexString[]}
   * @example
   * const layers = tree.getLayers()
   */
  getLayers() {
    return this.layers
  }

  /**
   * getRoot
   * @desc Returns the Merkle root hash as a HexString.
   * @return {HexString}
   * @example
   * const root = tree.getRoot()
   */
  getRoot() {
    return this.layers[this.layers.length-1][0]
  }

  /**
   * getProof
   * @desc Returns the proof for a target leaf.
   * @param {HexString} leaf - Target leaf
   * @param {Number} [index] - Target leaf index in leaves array.
   * Use if there are leaves containing duplicate data in order to distinguish it.
   * @return {HexString[]} - Array of HexString hashes.
   * @example
   * const proof = tree.getProof(leaves[2])
   *
   * @example
   * const leaves = ['a', 'b', 'a'].map(x => sha3(x))
   * const tree = new MerkleTree(leaves, sha3)
   * const proof = tree.getProof(leaves[2], 2)
   */
  getProof(leaf, index) {
    const proof = [];

    if (typeof index !== 'number') {
      index = -1

      for (let i = 0; i < this.leaves.length; i++) {
        if (leaf === this.leaves[i]) {
          index = i
        }
      }
    }

    if (index <= -1) {
      return []
    }

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]
      const isRightNode = index % 2
      const pairIndex = (isRightNode ? index - 1 : index + 1)

      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? 'left': 'right',
          data: layer[pairIndex]
        })
      }

      // set index to parent index
      index = (index / 2)|0
    }

    return proof
  }
}

module.exports = MerkleTree
