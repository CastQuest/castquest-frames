// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Errors} from "../libs/Errors.sol";

contract CastQuestRegistry {
    address public owner;
    mapping(bytes32 => address) private _modules;

    constructor(address _owner) {
        require(_owner != address(0), Errors.ZERO_ADDRESS);
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, Errors.NOT_AUTHORIZED);
        _;
    }

    function registerModule(bytes32 kind, address module) external onlyOwner {
        require(module != address(0), Errors.ZERO_ADDRESS);
        _modules[kind] = module;
    }

    function getModule(bytes32 kind) external view returns (address) {
        return _modules[kind];
    }
}
