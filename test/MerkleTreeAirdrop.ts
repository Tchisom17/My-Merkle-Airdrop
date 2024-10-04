// import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { MerkleTree } from "merkletreejs";
// import keccak256 from "keccak256";
// const helpers = require("@nomicfoundation/hardhat-network-helpers");
// const abicoder = new ethers.AbiCoder();

// describe("MerkleTreeAirdrop", function () {
//   async function deployFixture() {
//     const [owner, claimant, otherAccount] = await ethers.getSigners();


//     // Deploy ERC20 Token
//     const Token = await ethers.getContractFactory("MyToken");
//     const token = await Token.deploy();


//     const dayc = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";


//     // Airdrop supply and Merkle Tree Setup
//     const totalAirdropSupply = ethers.parseUnits("1000", 18); // 1000 tokens for airdrop

//     const merkleElements = [
//       { account: claimant.address, amount: ethers.parseUnits("500", 18) }, // Eligible account
//     ];
    
//     const merkleLeaves = merkleElements.map((elem) =>
//       keccak256(abicoder.encode(["address", "uint256"], [elem.account, elem.amount]))
//     );
    
//     const merkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true });
//     const merkleRoot = merkleTree.getHexRoot();

//     // Deploy MerkleTreeAirdrop
//     const Airdrop = await ethers.getContractFactory("MerkleTreeAirdrop");
//     const airdrop = await Airdrop.deploy(token, dayc, merkleRoot, totalAirdropSupply);

//     // Mint and Approve tokens for airdrop contract
//     // await token.mint(airdrop.address, totalAirdropSupply);

//     // Mint an NFT for the claimant to be eligible
//     // await nft.mint(claimant.address);

//     return { airdrop, token, dayc, owner, claimant, otherAccount, merkleTree, totalAirdropSupply, merkleElements };
//   }

//   describe("Deployment", function () {
//     it("Should set the correct owner and initial parameters", async function () {
//       const { airdrop, owner, totalAirdropSupply } = await loadFixture(deployFixture);
//       // const totalAirdropSupply = ethers.parseEther("1000");

//       expect(await airdrop.owner()).to.equal(owner.address);
//       expect(await airdrop.totalAirdropSupply()).to.equal(totalAirdropSupply);
//     });
//   });

//   describe("Claim Airdrop", function () {
//     it("Should allow eligible claimant to claim airdrop", async function () {
//       const { airdrop, token, claimant, dayc, merkleTree, merkleElements } = await loadFixture(deployFixture);
//       // const element = merkleElements[0];
//       const holder = "0x7285e8F0186a0A41E73ceF7603AD7b80A2d5a793";
//       const [owner] = await ethers.getSigners(); // Gets a funded signer from Hardhat
//       const tx = await owner.sendTransaction({
//         to: holder,
//         value: ethers.parseEther("10"), // Fund 1 ETH
//       });
//       await tx.wait();
//       console.log("Funded the holder account with 1 ETH");


//       await helpers.impersonateAccount(holder);
//       const impersonatedSigner = await ethers.getSigner(holder);

//       console.log("Generating proof");
//       const amount = ethers.parseEther("10");

//       // const dayc_contract = await ethers.getContractAt("IERC721", dayc, impersonatedSigner);


//       // Generate the proof for the eligible claimant
//       const merkleLeaf = keccak256(abicoder.encode(["address", "uint256"], [impersonatedSigner.address, amount]));
//       const proof = merkleTree.getHexProof(merkleLeaf);

//       console.log("Claim");
//       // Claim the airdrop
//       await airdrop.connect(impersonatedSigner).claim(amount, proof);

//       console.log(amount);

//       // Check the token balance of claimant after claim
//       expect(await token.balanceOf(impersonatedSigner.address)).to.equal(amount);
//     });

//   //   it("Should prevent double claiming of airdrop", async function () {
//   //     const { airdrop, token, claimant, merkleTree, merkleElements } = await loadFixture(deployFixture);
//   //     const element = merkleElements[0];

//   //     // Generate the proof for the eligible claimant
//   //     const merkleLeaf = keccak256(abicoder.encode(["address", "uint256"], [element.account, element.amount]));
//   //     const proof = merkleTree.getHexProof(merkleLeaf);

//   //     // Claim the airdrop
//   //     await airdrop.connect(claimant).claim(element.amount, proof);

//   //     // Try to claim again and expect a revert
//   //     await expect(airdrop.connect(claimant).claim(element.amount, proof)).to.be.revertedWith("Token already claimed!");
//   //   });

//   //   it("Should reject claim for an ineligible account", async function () {
//   //     const { airdrop, otherAccount, merkleTree, merkleElements } = await loadFixture(deployFixture);
//   //     const element = merkleElements[0];

//   //     // Generate proof for another account (should be invalid)
//   //     const merkleLeaf = keccak256(abicoder.encode(["address", "uint256"], [otherAccount.address, element.amount]));
//   //     const proof = merkleTree.getHexProof(merkleLeaf);

//   //     // Try to claim airdrop as an ineligible account
//   //     await expect(airdrop.connect(otherAccount).claim(element.amount, proof)).to.be.revertedWith("Invalid proof!");
//   //   });
//   });

//   // describe("Withdraw Token", function () {
//   //   it("Should allow owner to withdraw remaining tokens after airdrop", async function () {
//   //     const { airdrop, token, owner } = await loadFixture(deployFixture);

//   //     // Owner can withdraw remaining tokens after airdrop is complete
//   //     await airdrop.connect(owner).withdrawToken(owner.address);

//   //     // Check that the owner's balance increases accordingly
//   //     expect(await token.balanceOf(owner.address)).to.be.gt(0);
//   //   });

//   //   it("Should prevent non-owners from withdrawing tokens", async function () {
//   //     const { airdrop, otherAccount } = await loadFixture(deployFixture);

//   //     // Non-owner should not be able to withdraw tokens
//   //     await expect(airdrop.connect(otherAccount).withdrawToken(otherAccount.address)).to.be.revertedWith("You are not the owner");
//   //   });
//   // });
// });

import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const abicoder = new ethers.AbiCoder();

describe("MerkleTreeAirdrop", function () {
  async function deployToken() {
    // Deploy ERC20 Token
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    return { token };
  }

  async function deployMerkleTree() {
    const [owner, claimant, otherAccount] = await ethers.getSigners();

    const bayc = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"; // Replace with your BAYC contract address (if applicable)

    // Airdrop supply and Merkle Tree Setup
    const totalAirdropSupply = ethers.parseUnits("1000", 18); // 1000 tokens for airdrop
    // const holder = "0x7285e8F0186a0A41E73ceF7603AD7b80A2d5a793";
    const merkleElements = [
      { account: claimant.address, amount: ethers.parseUnits("500", 18) }, // Eligible account
    ];

    const { token } = await loadFixture(deployToken);
    // const merkleLeaves = merkleElements.map((elem) =>
    //   keccak256(abicoder.encode(["address", "uint256"], [elem.account, elem.amount]))
    // );

    // const merkleTree = new MerkleTree(merkleLeaves, keccak256, { sortPairs: true });
    // const merkleRoot = merkleTree.getHexRoot();
    const merkleRoot = "0xef84b0979b3c6ee300643541817d2a1d5bf2f7b7256c49b766efc5867e562bd3";

    // Deploy MerkleTreeAirdrop
    const Airdrop = await ethers.getContractFactory("MerkleTreeAirdrop");
    const airdrop = await Airdrop.deploy(token, bayc, merkleRoot, totalAirdropSupply);

    // Mint and Approve tokens for airdrop contract (if needed)
    // await token.mint(airdrop.address, totalAirdropSupply);

    // Mint an NFT for the claimant to be eligible (if applicable)
    // await nft.mint(claimant.address);

    return { airdrop, token, bayc, owner, claimant, otherAccount, totalAirdropSupply, merkleElements };
  }

  describe("Deployment", function () {
    it("Should set the correct owner and initial parameters", async function () {
      const { airdrop, owner, totalAirdropSupply } = await loadFixture(deployMerkleTree);
      // const totalAirdropSupply = ethers.parseEther("1000");

      expect(await airdrop.owner()).to.equal(owner.address);
      expect(await airdrop.totalAirdropSupply()).to.equal(totalAirdropSupply);
    });
  });

  describe("Claim Airdrop", function () {
    it("Should allow eligible claimant to claim airdrop", async function () {
      const { airdrop, token, owner, claimant, bayc, merkleElements } = await loadFixture(deployMerkleTree);
      const holder = "0x7285e8F0186a0A41E73ceF7603AD7b80A2d5a793";
     await helpers.impersonateAccount(holder);
     const impersonatedSigner = await ethers.getSigner(holder);

await helpers.setBalance(impersonatedSigner.address, ethers.parseEther("1"));


console.log("Balance after funding:", await ethers.provider.getBalance(impersonatedSigner.address));

      // Generate the proof for the eligible claimant
      // const merkleLeaf = keccak256(abicoder.encode(["address", "uint256"], [impersonatedSigner.address, merkleElements[0].amount]));
      const proof = [
        "0x05b28a1511c494782bba5f674a14e4f59461fe135a64ab861060973679c13d1d",
      "0x05fd4f9876fe16c4f58339d1a7d50414f14b5f442a20a6bd71ca7dd77d57c3f5",
      "0xf7aca8148eca2bd85a28875118e8d8dfc42f754ad27f89ff285f91c97feb2804"
      ]
      console.log("claiming airdrop")
      // Claim the airdrop
      await airdrop.connect(impersonatedSigner).claim(merkleElements[0].amount, proof);
      console.log("airdrop claimed")

      // Check the token balance of claimant after claim
      expect(await token.balanceOf(impersonatedSigner)).to.equal(merkleElements[0].amount);
    });

  })});