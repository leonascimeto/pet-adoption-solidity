import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";


describe("PetAdoption", function() {

   async function deployContractFixture() {
      const [owner] = await ethers.getSigners();
      const PetAdoption = await ethers.getContractFactory("PetAdoption");
      const contract = await PetAdoption.deploy();
      await contract.waitForDeployment();
      return {owner, contract};
   }

   describe("Deployment", function() {
      it("Should set the right owner", async function() {
         const {owner, contract} = await loadFixture(deployContractFixture);
         const contractOwner = await contract.owner();
         expect(contractOwner).to.equal(owner.address);
      });

      it("Should return the right owner", async function() {
         const {owner, contract} = await loadFixture(deployContractFixture);
         const contractOwner = await contract.getOwner();
         expect(contractOwner).to.equal(owner.address);
      });
   });
 });
 