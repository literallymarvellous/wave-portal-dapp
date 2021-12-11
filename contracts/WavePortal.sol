//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
  string public greeting;

  struct Wave {
    address waver;
    string message;
    uint256 timestamp;
  }

  event NewWave (
    address indexed from,
    string message,
    uint256 timestamp
  );

  Wave[] waves;

  constructor(string memory _greeting) {
    greeting = _greeting;
  }

  function greet() public view returns(string memory) {
      return greeting;
  }

  function message(string memory _message) public {
    greeting = _message;
    waves.push(Wave(msg.sender, _message, block.timestamp));
    emit NewWave(msg.sender, greeting, block.timestamp);
  }

  function getAllWaves() public view returns(Wave[] memory) {
      return waves;
  }
}