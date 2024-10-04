// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MyToken.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MerkleTreeAirdrop {
    using SafeERC20 for MyToken;

    IERC721 public baycNFT;
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
    constructor (MyToken _token, address _baycNft, bytes32 _merkleRoot, uint256 _totalAirdropSuply) {
        myToken = _token;
        baycNFT = IERC721(_baycNft);
        merkleRoot = _merkleRoot;
        owner = msg.sender;
        totalAirdropSupply = _totalAirdropSuply;
    }

    function claim(uint _amount, bytes32[] calldata merkleProof) external {
        require(canClaim(msg.sender, _amount, merkleProof), "You are not eligible!");

        claimed[msg.sender] = true;
        totalClaimed += _amount;

        myToken.safeTransfer(msg.sender, _amount);

        emit Claimed(msg.sender, _amount);
    }

    function withdrawToken(address to) external onlyOwner {

        require(checkAirdropStatus(), "Airdrop is not complete!");
        
        uint256 remainingTokens = myToken.balanceOf(address(this)) - (totalAirdropSupply - totalClaimed);
        require(remainingTokens > 0, "No tokens left to withdraw!");

        myToken.safeTransfer(to, remainingTokens);
    }

    function checkAirdropStatus() internal  view returns(bool) {
        return totalClaimed >= totalAirdropSupply;
    }

    // function setNFTOwnerBalance(address _owner) external {
    //     baycNFT.balanceOf(_owner);
    //     emit MerkleRootUpdated(merkleRoot);
    // }

    function canClaim(address claimer, uint _amount, bytes32[] calldata merkleProof) public view returns (bool) {
        require(!claimed[claimer], "Token already claimed!");
        require(baycNFT.balanceOf(claimer) > 0, "Must own BAYC NFT");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));

        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid proof!");
        require(totalClaimed + _amount <= totalAirdropSupply, "Exceeds total airdrop supply!");

        return true;
    }
}