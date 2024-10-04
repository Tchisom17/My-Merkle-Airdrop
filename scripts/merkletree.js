const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');
const csv = require('csv-parser');
const { ethers, AbiCoder } = require('ethers');

const results = [];
const abiCoder = new AbiCoder();

const filename = "generated_files/airdrop.csv";
const proof_file = "generated_files/proofs.json";

fs.createReadStream(filename)
  .pipe(csv())
  .on('data', (data) => {
    results.push({
      address: data.user_address,
      amount: ethers.parseEther(data.amount)
    });
  })
  .on('end', () => {
    const leaves = results.map(item => 
      keccak256(abiCoder.encode(['address', 'uint256'], [item.address, item.amount]))
    );
    
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot = merkleTree.getHexRoot();

    console.log('Merkle Root:', merkleRoot);

    const proofs = results.map(item => {
      const leaf = keccak256(abiCoder.encode(['address', 'uint256'], [item.address, item.amount]));
      return {
        address: item.address,
        amount: ethers.formatEther(item.amount),
        proof: merkleTree.getHexProof(leaf)
      };
    });

    fs.writeFileSync(proof_file, JSON.stringify(proofs, null, 2));
    console.log(`Proofs saved to ${proof_file}`);
  });


  // merkle root: 0xc2d824da5487210a904f3cb2c013cc66261044767ef0e24bafb7f3f30eb30d8a