// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Collection is ERC721, ERC721Enumerable, ERC721URIStorage {
    address public owner;
    string  public collectionName;
    address public collectionAddr;
    string  public collSymbol;
    
    using SafeMath for uint256;

    uint public constant mintPrice = 0; 
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    
    function tokenURI (uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI (tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
       return super.supportsInterface(interfaceId);
    }

    

  constructor(
    address _owner,
    string memory _collName,
    string memory _symbol
    
  ) ERC721(_collName, _symbol) {
        owner  = _owner;
        collSymbol = _symbol;
        collectionName = _collName;
        collectionAddr = address(this);
  }



    function mint(string memory _uri) public payable {
        uint256 mintIndex = totalSupply();
        _safeMint (msg.sender, mintIndex);
        _setTokenURI(mintIndex, _uri);
    }
}

contract CollactionFactory {
    Collection[] public collections;


    function create(address _owner, string memory _collName, string memory _symbol) public {
        Collection collection = new Collection(_owner, _collName, _symbol);
        collections.push(collection);


    }

    
    function getlastObject()public view returns (address owner,
            string memory collectionName,
            string memory collSymbol,
            address collectionAddr){
        Collection collection = collections[collections.length -1];
        return (collection.owner(), collection.collectionName(),collection.collSymbol(), collection.collectionAddr());
    }


    function getCar(uint _index)
        public
        view
        returns (
            address owner,
            string memory collectionName,
            string memory collSymbol,
            address collectionAddr
        )
    {
        Collection collection = collections[_index];

        return (collection.owner(), collection.collectionName(),collection.collSymbol(), collection.collectionAddr());
    }
}
