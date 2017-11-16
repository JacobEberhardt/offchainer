// Required version
pragma solidity ^0.4.11;

// Import dependencies
import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/Standard.sol';

contract TestStandard {
	
	// Instantiate
	Standard standard = Standard(DeployedAddresses.Standard());

}
