 //SPDX-License-Identifier: Unlicense

 // NFT Share to Driver by Arjun Shrivas


pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    
    //_driverIds for track of the number of registered Driver 
    Counters.Counter private _driverIds;

    //owner is the contract address that created the smart contract
    address payable owner;
    
    
    uint256 constant NULL = 0;
  
    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 driverId;
        bool currentlyListed;
    }
    
    struct Drivers {
        uint256 driverId;
        uint256 nftId; 
        address nftaddrr;
        string Dname;
        string mobile;
        string age;
        string gender;
        bool available;
    }


   //the event emitted when a Driver is successfully registered
    event DriversRegisteredSuccess (
        uint256 driverId,
        uint256  nftId, 
        address nftaddrr,
        string Dname,
        string mobile,
        string age,
        string gender,
        bool available
    );

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 driverId,
        bool currentlyListed
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;
    mapping(uint256 => Drivers) private idToDriveRegister;

    constructor() ERC721("DriverShare", "NFT") {
        owner = payable(msg.sender);
    }

    
    //The first time a token is created, it is listed here
    function createToken(string memory tokenURI) public payable returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        createListedToken(newTokenId);

        return newTokenId;
    }

    
    function createListedToken(uint256 tokenId) private {
       
        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            NULL,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
       
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            NULL,
            true
        );
    }




    
    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        //at the moment currentlyListed is true for all, if it becomes false in the future we will 
        //filter out currentlyListed == false over here
        for(uint i=0;i<nftCount;i++)
        {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }
    
    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }


    //Drive Registeration Function his own details from Application
    function DriverRegister(string memory name,string memory mobile,string memory age,string memory gender) public  {
        //Increment the driverId counter, which is keeping track of the number of Driver Listed.
        _driverIds.increment();
        uint256 newDriverId = _driverIds.current();
        

        idToDriveRegister[newDriverId] = Drivers(
                                            newDriverId,
                                            NULL,
                                            address(0),
                                            name,
                                            mobile,
                                            age,
                                            gender,
                                            true
                                        );
        
         //Emit the event for successful Driver Registration. The frontend parses this message and updates the end user
        emit DriversRegisteredSuccess(
            newDriverId,
            NULL,
            address(0),
            name,
            mobile,
            age,
            gender,
            true
            );

                   
    }


    
    function shareNft(uint256 _tokeId,uint256 _driverId, address _nftAddress) public {

        // check drive is present or not of thdriverIdis nft Id
        require(idToListedToken[_tokeId].driverId  <= 0  , "This nft already have driver");
        
        // check drive is available or not 
        require(idToDriveRegister[_driverId].available != false , "this driver already assigned to other vehicle");
        
      
         idToListedToken[_tokeId].driverId  = _driverId;
         idToDriveRegister[_driverId].nftId = _tokeId;
         idToDriveRegister[_driverId].nftaddrr = _nftAddress;
         idToDriveRegister[_driverId].available = false;
        
        
                   
    }

   
   function nftDriverDetails(uint256 _tokeId) public view returns (Drivers memory) {

        // check drive is present or not of this nft Id
        require(idToListedToken[_tokeId].driverId  != 0  , "Not found any driver");
        
      
         return (idToDriveRegister[idToListedToken[_tokeId].driverId]);
             
                   
    }


    function removeDriver(uint256 _tokeId, uint256 _driverId) public {

         idToListedToken[_tokeId].driverId  = NULL;
         idToDriveRegister[_driverId].nftId = NULL;
         idToDriveRegister[_driverId].nftaddrr = address(0);
         idToDriveRegister[_driverId].available = true;
        
             
                   
    }


    //This will return all the Driver listed
    function getAllDrivers() public view returns (Drivers[] memory) {
        uint driverCount = _driverIds.current();
        Drivers[] memory driver = new Drivers[](driverCount);
        uint currentIndex = 0;
        uint currentId;
        
        for(uint i=0;i<driverCount;i++)
        {
            currentId = i + 1;
            Drivers storage currentItem = idToDriveRegister[currentId];
            driver[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'Driver' 
        return driver;
    }
    
    //This will return all the Driver listed
    function getAvailableDrivers() public view returns (Drivers[] memory) {
        uint driverCount = _driverIds.current();
       uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;

        for(uint i=0; i < driverCount; i++)
        {
            if(idToDriveRegister[i+1].available == true){
                itemCount += 1;
            }
        }
        

      //Once you have the count of available drivers, create an array then store all the drive in it
        Drivers[] memory driver = new Drivers[](itemCount);
        for(uint i=0; i < driverCount; i++) {
            if(idToDriveRegister[i+1].available == true) {
                currentId = i+1;
                Drivers storage currentItem = idToDriveRegister[currentId];
                driver[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        
        return driver;
    }
  
}