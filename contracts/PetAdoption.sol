// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract PetAdoption {
   address public owner;
   uint public petIndex = 0;
   uint [] public allAdoptedPets;

   mapping(uint => address) public petIdxToOwnerAddress;
   mapping(address => uint[]) public ownerAddressToPetList;

   constructor(uint initialPetIndex) {
         petIndex = initialPetIndex;
         owner = msg.sender;
   }

   modifier onlyOwner() {
      require(msg.sender == owner, "Only the owner can call this function.");
      _;
   }

   function addPet() public onlyOwner {
      petIndex++;
   }

   function adobtPet(uint adoptIdx) public {
      require(adoptIdx < petIndex, "Pet index does not exist");
      require(petIdxToOwnerAddress[adoptIdx] == address(0), "Pet is already adopted");
      
      petIdxToOwnerAddress[adoptIdx] = msg.sender;
      ownerAddressToPetList[msg.sender].push(adoptIdx);
      allAdoptedPets.push(adoptIdx);
   }

   function getOwner() public view returns (address) {
      return owner;
   }

}