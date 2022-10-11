import { React, useState, useEffect }from "react";
import { useHistory } from "react-router-dom";
import { useMoralis , useMoralisQuery} from "react-moralis";
import { Modal, Input, Alert, Spin, Button, Menu, Dropdown, Space } from "antd";
import { InfoCircleOutlined , DownOutlined } from "@ant-design/icons";
import UserCollection from "components/UserCollection";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import Web3 from "web3"
import Moralis  from "moralis";
import { contractAddress , contractabi } from "../contractMint";
import moment from 'moment';
import { PolygonLogo, BSCLogo, ETHLogo } from "./Chains/Logos";
import { collectionAddr, CollectionFactoryABI , CollectionABI } from "../collectionContract/abi/CollectionContract";

const web3 = new Web3(Web3.givenProvider)

const styles = {
    item: {
        width : "200px",
      display: "flex",
      alignItems: "center",
      height: "42px",
      fontWeight: "500",
      fontFamily: "Roboto, sans-serif",
      fontSize: "14px",
      padding: "0 10px",
    },
    button: {
      border: "2px solid rgb(231, 234, 243)",
      borderRadius: "12px",
    },
  };


function MyNFTCollection(props) {

    const history = useHistory();
    useEffect(() => {
      if (!props.loggedStatus) {
        history.push("/NFTMarketPlace");
      }
    }, [history, props.loggedStatus]);
    const {user } = useMoralis();
    const { chainId } = useMoralisDapp();
    const [collectionName, setcollectionName] = useState();
    const [collectionSymbol, setcollectionSymbol] = useState();
    
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState({});
  
    const [visible, setVisibility] = useState(false);

    

    const handalModalClick = () => {
        setVisibility(true)
    };


    const onCrateCollection  = async (e)=>{
     setLoading(true)
        console.log("createCollectionClick...", collectionName , collectionSymbol)

       
          try {
            const contract = new web3.eth.Contract(CollectionFactoryABI,collectionAddr);
            console.log(collectionAddr)
      
      
             const response = await contract.methods
             .create(user.get("ethAddress"),collectionName,collectionSymbol)
             .send({from:user.get("ethAddress")});
      
             console.log("resopse:- ", response)
    
              var dateAndTime= moment().format("DD/MM/YYYY HH:mm:ss")
    
             const getAddress = await contract.methods
             .getlastObject().call();
      
             const Collections = Moralis.Object.extend("Collections");
           
               const Object = new Collections();
               
               Object.set("ownerAddress", getAddress.owner);
               Object.set("CollectionName", getAddress.collectionName);
               Object.set("CollectionAddress", getAddress.collectionAddr);
               Object.set("symbol", getAddress.collSymbol);
               Object.set("chain",chainId)
               Object.set("status",false)
               Object.save();
              
                   
          alert(`Collection sucessfully Created - ${contractAddress}`);
          setLoading(false)
          succCreated(contractAddress)
          setVisibility(false)
          } catch (error) {
            setLoading(false)
            failCreation()
            setVisibility(false)
            console.log("collection reaction error : ",error)
          }
         
    
    
    
          
                 
    
        //   const tokenId = response.events.Transfer.returnValues.tokenId;
    
        //   alert(`NFT sucessfully minted Contract address - ${contractAddress} and TokenId - ${tokenId}`);
        //   console.log(`NFT sucessfully minted Contract address - ${contractAddress} and TokenId - ${tokenId}`)
    
       
    
    }

    function succCreated(e) {
      let secondsToGo = 5;
      const modal = Modal.success({
        title: "Success!",
        content: `Collection sucessfully Created - ${e}`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }
  
    function failCreation() {
      let secondsToGo = 5;
      const modal = Modal.error({
        title: "Error!",
        content: `There was a problem when purchasing this NFT`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }

    const handleMenuClick = (e) => {
        console.log("switch to: ", e.key);
        setcollectionSymbol(e.key)
       // switchNetwork(e.key);
      };

    

    return (
        <div       
            style={{
                display: "flex",
                flexDirection: "column",
                margin: "1rem 5rem",
            }}
        >
            <header>
                <div
                    style={{
                    padding: "0.75rem",
                    }}
                >
                    <h1 style={{fontWeight: "600", fontSize: "40px"}}>
                        My Collection
                    </h1>
                    <span>
                        <div style={{fontSize: "16px", fontWeight: "500"}}>
                            Create, curate, and manage collections of unique NFTs to share and sell.
                            <Button className="icon-info-circle" title="Collections can be created either directly or imported from existing Smart Contract.">
                                <InfoCircleOutlined style={{ fontSize: "18px", background: "inherit", alignItems: "center"}}/>
                            </Button>
                        </div>
                        <div style={{ "margin-top": "20px" }}>
                            <button type="button" class="ant-btn ant-btn-primary ant-btn-lg" style={{"border-radius": "12px"}} onClick={() => handalModalClick()}>
                                <span>Create a Collection</span>
                            </button>
                        </div>
                    </span>
                </div>
            </header>
            <div style={{ "margin-top": "20px" }}>
              <UserCollection />
              {/* <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue}/> */}
            </div>

            <Modal
                title={`List  # For Sale`}
                visible={visible}
                onCancel={() => setVisibility(false)}
                
                okText="List"
                footer={[
                <Button onClick={() => setVisibility(false)}>
                    Cancel
                </Button>,
                
                <Button onClick={() => onCrateCollection()} type="primary">
                    Submit
                </Button>
                ]}
            >

              
              <Spin spinning={loading}>
               
                <Input
                    autoFocus
                    type="text" 
                    id="CollectionName" 
                    placeholder="Collection Name"
                    value={collectionName}
                    
                    onChange={e => setcollectionName(e.target.value)}
                />

                <Input
                
                    autoFocus
                    type="text" 
                    id="CollectionSymbol" 
                    placeholder="Symbol Of Collection"
                    value={collectionSymbol}
                    
                    onChange={e => setcollectionSymbol(e.target.value)}
                />
                
              </Spin>
           </Modal>
        </div>
    );
}

export default MyNFTCollection;
