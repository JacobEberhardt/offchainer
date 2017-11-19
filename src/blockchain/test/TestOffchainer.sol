// Required version
pragma solidity ^0.4.11;

// Import dependencies
import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/Offchainer.sol';

contract TestOffchainer {
	
	// Instantiate
	Offchainer offchainer = Offchainer(DeployedAddresses.Offchainer());

}
