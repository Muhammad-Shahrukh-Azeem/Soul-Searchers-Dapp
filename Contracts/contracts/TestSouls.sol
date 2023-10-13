//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "erc721a/contracts/ERC721A.sol";

contract TestSouls is ERC721A {
    string public _tokenURISuffix = ".json";
    string public _currentBaseURI = "https://soul-searchers-staking-complete.vercel.app/api/file";

    constructor() ERC721A("TestSoul", "TS") {}

    function mint(uint256 quantity) external payable {
        // _safeMint's second argument now takes in a quantity, not a tokenId.
        _safeMint(msg.sender, quantity);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _currentBaseURI;
    }

    function setBaseURI(string calldata baseURI) external {
        _currentBaseURI = baseURI;
    }


    function setTokenURISuffix(string calldata suffix) external {
        _tokenURISuffix = suffix;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721A) returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length != 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        _toString(tokenId),
                        _tokenURISuffix
                    )
                )
                : "";
    }
}
