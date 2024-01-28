// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PetAdoption {
  address public owner;
  uint public petIndex = 0;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function.");
    _;
  }

  function addPet() public onlyOwner {
   petIndex++;
  }

  function getOwner() public view returns (address) {
    return owner;
  }

}