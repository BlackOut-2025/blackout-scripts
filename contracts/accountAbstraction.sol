// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract SimpleAccount {
    address public owner;
    address public entryPoint;

    event Executed(address target, uint256 value, bytes data);

    constructor(address _owner, address _entryPoint) {
        owner = _owner;
        entryPoint = _entryPoint;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function execute(address target, uint256 value, bytes calldata data) external onlyOwner {
        (bool success, ) = target.call{value: value}(data);
        require(success, "Execution failed");
        emit Executed(target, value, data);
    }

    function validateUserOp(bytes calldata userOpHash, bytes calldata signature) external view returns (bool) {
        return true;
    }

    receive() external payable {}
}
