import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import hre from "hardhat";
import { ProtoNFT, ProtoNFT__factory } from "../typechain-types";

describe("ProtoNFT", function (): void {
 
  async function deployFixture(): Promise<{
    signers: HardhatEthersSigner[];
    protoNFTInstance: ProtoNFT;
  }> {
    const signers: HardhatEthersSigner[] = await hre.ethers.getSigners();
    const protoNFTFactory: ProtoNFT__factory =
      await hre.ethers.getContractFactory("ProtoNFT");
    const protoNFTInstance: ProtoNFT = await protoNFTFactory.deploy();

    return { signers, protoNFTInstance };
  }

  it("should mint some NFTs", async ():Promise<void> => {
    const {signers, protoNFTInstance} = await loadFixture(deployFixture);
    const buyerAccount:HardhatEthersSigner = signers[1];
    const quantity:bigint = 3n;
    const price:bigint = await protoNFTInstance.getPrice();
    const totalPayment:bigint = quantity * price; 
    const otherInstance:ProtoNFT = protoNFTInstance.connect(buyerAccount);
    await otherInstance.mint(quantity, {value:totalPayment});
    const balanceOfBuyer:bigint = await protoNFTInstance.balanceOf(buyerAccount);

    expect(balanceOfBuyer).to.equal(quantity);
  });


  it("should NOT mint some NFTs (not enough ether)", async ():Promise<void> => {
    const {signers, protoNFTInstance} = await loadFixture(deployFixture);
    const buyerAccount:HardhatEthersSigner = signers[1];
    const quantity:bigint = 3n;
    const price:bigint = await protoNFTInstance.getPrice();
    const totalPayment:bigint = price; 
    const otherInstance:ProtoNFT = protoNFTInstance.connect(buyerAccount);
    await expect(otherInstance.mint(quantity, {value:totalPayment})).to.be.revertedWith("Insufficient payment");
  });


  it("should burn a NFT", async ():Promise<void> => {
    const {signers, protoNFTInstance} = await loadFixture(deployFixture);
    const buyerAccount:HardhatEthersSigner = signers[1];
    const quantity:bigint = 3n;
    const price:bigint = await protoNFTInstance.getPrice();
    const totalPayment:bigint = quantity * price;
    const otherInstance:ProtoNFT = protoNFTInstance.connect(buyerAccount);
    await otherInstance.mint(quantity, {value:totalPayment});

    await otherInstance.burn(0);

    const balanceOf:bigint = await protoNFTInstance.balanceOf(buyerAccount);

    expect(balanceOf).to.equal(quantity - 1n);
  });


  it("should NOT burn a NFT", async ():Promise<void> => {
    const {signers, protoNFTInstance} = await loadFixture(deployFixture);
    const buyerAccount:HardhatEthersSigner = signers[1];
    const quantity:bigint = 3n;
    const price:bigint = await protoNFTInstance.getPrice();
    const totalPayment:bigint = quantity * price;
    const otherInstance:ProtoNFT = protoNFTInstance.connect(buyerAccount);
    await otherInstance.mint(quantity, {value:totalPayment});

    await expect(protoNFTInstance.burn(0)).to.be.revertedWith("You are not the owner");

  });

  it("should withdraw ether from the ProtoNFT smart contract", async ():Promise<void> => {
    const {signers, protoNFTInstance} = await loadFixture(deployFixture);
    const buyerAccount:HardhatEthersSigner = signers[1];
    const quantity:bigint = 3n;
    const price:bigint = await protoNFTInstance.getPrice();
    const totalPayment:bigint = quantity * price; 
    const otherInstance:ProtoNFT = protoNFTInstance.connect(buyerAccount);
    await otherInstance.mint(quantity, {value:totalPayment});

    await protoNFTInstance.withdraw();

    const amountOfEtherLocked:bigint = await hre.ethers.provider.getBalance(protoNFTInstance);

    expect(amountOfEtherLocked).to.equal(0);
  });

  it("should NOT withdraw ether from the ProtoNFT smart contract (not owner)", async ():Promise<void> => {
    const {signers, protoNFTInstance} = await loadFixture(deployFixture);
    const buyerAccount:HardhatEthersSigner = signers[1];
    const quantity:bigint = 3n;
    const price:bigint = await protoNFTInstance.getPrice();
    const totalPayment:bigint = quantity * price; 
    const otherInstance:ProtoNFT = protoNFTInstance.connect(buyerAccount);
    await otherInstance.mint(quantity, {value:totalPayment});

    await expect(otherInstance.withdraw()).to.be.revertedWith("You do not have permission");

    
  });

  it("should get the correct tokenURI", async ():Promise<void> => {
    const {signers, protoNFTInstance} = await loadFixture(deployFixture);
    const buyerAccount:HardhatEthersSigner = signers[1];
    const quantity:bigint = 3n;
    const price:bigint = await protoNFTInstance.getPrice();
    const totalPayment:bigint = quantity * price; 
    const otherInstance:ProtoNFT = protoNFTInstance.connect(buyerAccount);
    await otherInstance.mint(quantity, {value:totalPayment});
    
    const baseURI:string = "https://lime-various-leopon-885.mypinata.cloud/ipfs/QmWzauq9heZFeVoEjW2Ye3iwAiqHqWi3kbB6V8Xhe6qHEe/";

    const tokenURI:string = await protoNFTInstance.tokenURI(0);

    expect(tokenURI).to.equal(`${baseURI}0.json`)

    
  });

});
