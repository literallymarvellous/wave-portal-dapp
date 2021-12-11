//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AIMToken is ERC20 {
  address public owner;

  constructor() ERC20("Ahiara Ike Marvel", "AIM") {
      _mint(msg.sender, 10000000000 * (10 ** 18));
      owner = msg.sender;
  }

  function mint(address to, uint256 amount) external {
      require(msg.sender == owner, "Only owner can mint new tokens");
      _mint(to, amount);
  }
}