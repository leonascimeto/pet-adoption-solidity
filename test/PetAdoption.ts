import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";


describe("PetAdoption", function() {

   async function deployContractFixture() {
      const PETS_COUNT = 5;
      const [owner, account2] = await ethers.getSigners();
      const PetAdoption = await ethers.getContractFactory("PetAdoption");
      const contract = await PetAdoption.deploy(PETS_COUNT);
      await contract.waitForDeployment();
      return {owner, contract, account2, petsAddedCount: PETS_COUNT};
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

   describe("Add Pet", function() {
      it("Should increase petIndex", async function() {
         const { contract, petsAddedCount } = await loadFixture(deployContractFixture);
         await contract.addPet();
         const petCount = await contract.petIndex();
         expect(petCount).to.equal(petsAddedCount + 1);
      });

      it("Should revert with the right error in case of other account", async function() {
         const {owner, contract, account2} = await loadFixture(deployContractFixture);
         await expect(contract.connect(account2).addPet())
            .to.be.revertedWith("Only the owner can call this function.");
      });
   });
 });
 