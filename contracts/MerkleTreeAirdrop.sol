// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MyNFT.sol";
import "./MyToken.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MerkleTreeAirdrop {
    using SafeERC20 for MyToken;

    MyNFT public myNFT;
    MyToken public immutable myToken;

    bytes32 public immutable merkleRoot;
    address public owner;
    uint256 public totalAirdropSupply;
    uint256 public totalClaimed;

    mapping(address => bool) public claimed;

    event Claimed(address indexed claimant, uint256 amount);
    event MerkleRootUpdated(bytes32 merkleRoot);

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not the owner");
        _;
    }
    constructor (MyToken _token, MyNFT _myNft, bytes32 _merkleRoot, uint256 _totalAirdropSuply) {
        myToken = _token;
        myNFT = _myNft;
        merkleRoot = _merkleRoot;
        owner = msg.sender;
        totalAirdropSupply = _totalAirdropSuply;
    }

    function claim(uint _amount, bytes32[] calldata merkleProof) external {
        require(canClaim(msg.sender, _amount, merkleProof), "Sorry, Your address is not eligible to claim token!");

        claimed[msg.sender] = true;
        totalClaimed += _amount;

        myToken.safeTransfer(msg.sender, _amount);

        emit Claimed(msg.sender, _amount);
    }

    function canClaim(address claimer, uint _amount, bytes32[] calldata merkleProof) public view returns (bool) {
        require(!claimed[claimer], "Token already claimed!");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));

        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid proof!");
        require(totalClaimed + _amount <= totalAirdropSupply, "Exceeds total airdrop supply!");

        return true;
    }

    // function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
    //     merkleRoot = _merkleRoot;
    //     emit MerkleRootUpdated(merkleRoot);
    // }

    function withdrawToken(address to) external onlyOwner {
        // uint256 balance = token.balanceOf(address(this));
        // require(balance > 0, "No tokens to withdraw.");
        // require(isAirdropComplete(), "Airdrop is not complete.");

        // require(token.transfer(to, balance), "Token transfer failed.");

        require(checkAirdropStatus(), "Airdrop is not complete!");
        
        uint256 remainingTokens = myToken.balanceOf(address(this)) - (totalAirdropSupply - totalClaimed);
        require(remainingTokens > 0, "No tokens left to withdraw!");

        myToken.safeTransfer(to, remainingTokens);
    }

    function checkAirdropStatus() internal  view returns(bool) {
        return totalClaimed >= totalAirdropSupply;
    }
}