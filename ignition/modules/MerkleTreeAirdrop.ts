import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const bayc = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const merkleRoot = "0xef84b0979b3c6ee300643541817d2a1d5bf2f7b7256c49b766efc5867e562bd3";
const tokenAddress = "0xd5A1A35AECF62f835fE82497D0Af50a9E0B3d9E5";
const totalAirdropSupply = 1000;

const MerkleTreeAirdropModule = buildModule("MerkleTreeAirdropModule", (m) => {
  const merkleTreeAirdrop = m.contract("MerkleTreeAirdrop", [tokenAddress, bayc, merkleRoot, totalAirdropSupply]);

  return { merkleTreeAirdrop };
});

export default MerkleTreeAirdropModule;
