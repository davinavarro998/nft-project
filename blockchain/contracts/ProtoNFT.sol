// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "erc721a/contracts/ERC721A.sol";

contract ProtoNFT is ERC721A  {

    address payable private _owner;

    uint256 constant private _price = 0.01 ether;

    constructor() ERC721A("ProtoNFT", "PNFT") {
        _owner = payable(msg.sender);
    }

    function mint(uint256 quantity) public payable {
        require(msg.value >= (_price * quantity), "Insufficient payment");
        _mint(msg.sender, quantity);
    }

    function burn(uint256 tokenId) external { 
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");   
        super._burn(tokenId, true);
    }

    function withdraw() external {
        require(msg.sender == _owner, "You do not have permission");

        uint256 amount = address(this).balance;
        (bool success,) = _owner.call{value: amount}("");
        require(success, "Failed to withdraw");
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://lime-various-leopon-885.mypinata.cloud/ipfs/QmWzauq9heZFeVoEjW2Ye3iwAiqHqWi3kbB6V8Xhe6qHEe/";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A)
        returns (string memory)
    {
        return string.concat(super.tokenURI(tokenId), ".json");
    }

    /* function contractURI() public pure returns (string memory) {
        return "ifps://QmZAakeXCKkgegHEKgCE9LbbrHEmrzHcYeA9wTcqbMsypt/contract.json";
    } */

    function getPrice() external pure returns (uint256) {
        return _price;
    }
}