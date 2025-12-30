// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Errors} from "../libs/Errors.sol";

contract CastQuestRegistry {
    mapping(address => bool) public isRegistered;
    
    event Registered(address indexed entity);
    
    function register(address entity) external {
        require(entity != address(0), Errors.InvalidAddress);
        require(!isRegistered[entity], Errors.AlreadyExists);
        
        isRegistered[entity] = true;
        emit Registered(entity);
    }
}

contract CastQuestRegistry {
    address public owner;
    mapping(bytes32 => address) private _modules;

    constructor(address _owner) {
        require(_owner != address(0), Errors.ZeroAddress);
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, Errors.NotAuthorized);
        _;
    }

    function registerModule(bytes32 kind, address module) external onlyOwner {
        require(module != address(0), Errors.ZeroAddress);
        _modules[kind] = module;
    }

    function getModule(bytes32 kind) external view returns (address) {
        return _modules[kind];
    }
}
