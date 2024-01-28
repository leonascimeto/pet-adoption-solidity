import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";


describe("PetAdoption", function() {

   async function deployContractFixture() {
      const PETS_COUNT = 5;
      const ADOPTED_PET_IDX = 0;

      const [owner, account2, account3] = await ethers.getSigners();
      const PetAdoption = await ethers.getContractFactory("PetAdoption");
      const contract = await PetAdoption.deploy(PETS_COUNT);
      await contract.waitForDeployment();

      await contract.connect(account3).adobtPet(ADOPTED_PET_IDX);

      return {
         owner, 
         account2, 
         account3,
         contract, 
         petsAddedCount: PETS_COUNT,
         adoptedPetIdx: ADOPTED_PET_IDX
      };
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

   describe("Adopt Pet", function() {
      it("Should revert with the index out of bounds", async function() {
         const {contract, petsAddedCount} = await loadFixture(deployContractFixture);
         await expect(contract.adobtPet(petsAddedCount + 1))
            .to.be.revertedWith("Pet index does not exist");
      });

      it("Should revert with the pet already adopted", async function() {
         const {contract, adoptedPetIdx} = await loadFixture(deployContractFixture);
         await expect(contract.adobtPet(adoptedPetIdx))
            .to.be.revertedWith("Pet is already adopted");
      });

      it("Should adopt the pet", async function() {
         const {contract, adoptedPetIdx, account2} = await loadFixture(deployContractFixture);
         const idx = 1;
         await expect(contract.connect(account2).adobtPet(idx)).not.to.be.reverted;
         expect(await contract.petIdxToOwnerAddress(idx)).to.equal(account2.address);
      });
   });

 });
 