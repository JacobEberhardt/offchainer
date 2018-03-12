// Required version
pragma solidity ^0.4.17;

contract Counter {

	// Declare variables
	bytes32 merkleRoot; // The integrity hash of the counters array

	// Declare events
	event RequestedCounterIncreaseEvent(bytes32 merkleRoot);
	event IntegrityCheckFailedEvent();
	event RootHashChangedEvent(bytes32 oldMerkleRoot, bytes32 newMerkleRoot, uint8 newCounterValue);

	// Define public functions
	/**
	 * Create a new contract instance.
	 */
	function Counter(bytes32 _merkleRoot) public {
		merkleRoot = _merkleRoot;
	}
	
	/**
	 * Set the Merkle root to the given value
	 * 
	 * @param _merkleRoot The given value for the Merkle root 
	 */
	 function setMerkleRoot(bytes32 _merkleRoot) public {
	    merkleRoot = _merkleRoot;
	 }
	

	/**
	 * Request the increase of the counter with the given index.
	 */
	function requestCounterIncrease() public {
		RequestedCounterIncreaseEvent(merkleRoot);
	}

	/**
	 * Perform an increase of the counter with the given index.
	 *
	 * @param _index The index of the counter to increase
	 * @param _checks An array that contains information which hashes need to be computed
	 * @param _indexOfFirstLeaf The index of the first leaf node
	 * @param _hashes The hashes which do not need to be computed
	 * @param _values The values of the leaf nodes which changed in this function
	 */
	function doCounterIncrease(uint8 _index, bool[] _checks, uint8 _indexOfFirstLeaf, bytes32[] _hashes, uint8[] _values) public {

		// Check integrity
	    if (_createTree(_checks, _indexOfFirstLeaf, _hashes, _values) != merkleRoot) {
			IntegrityCheckFailedEvent();
			return;
		}

		// Increase counter
		_values[_indexOfFirstLeaf + _index] += 1;

		// Update merkle root and throw event
		bytes32 oldMerkleRoot = merkleRoot;
		merkleRoot = _createTree(_checks, _indexOfFirstLeaf, _hashes, _values);
		RootHashChangedEvent(oldMerkleRoot, merkleRoot, _values[_indexOfFirstLeaf + _index]);

	}

	// Define private functions
	function _createTree(bool[] _checks, uint8 _indexOfFirstLeaf, bytes32[] _hashes, uint8[] _values) private view returns (bytes32 hash) {
		return _computeHash(0, _checks, _indexOfFirstLeaf, _hashes, _values);
	}

	function _computeHash(uint8 _index, bool[] _checks, uint8 _indexOfFirstLeaf, bytes32[] _hashes, uint8[] _values) private constant returns (bytes32 hash) {

		// Check if hash is given
		if (!_checks[_index]) {
			return _hashes[_index];
		}

		// Check if value is given
		if (_index >= _indexOfFirstLeaf) {
			return keccak256(_values[_index]);
		}

		// Compute hash from the children hashes
		return keccak256(
			_computeHash(_leftChild(_index), _checks, _indexOfFirstLeaf, _hashes, _values),
			_computeHash(_rightChild(_index), _checks, _indexOfFirstLeaf, _hashes, _values)
		);

	}

	function _leftChild(uint8 _index) private pure returns (uint8) {
		return _index * 2 + 1;
	}

	function _rightChild(uint8 _index) private pure returns (uint8) {
		return _index * 2 + 2;
	}

}
