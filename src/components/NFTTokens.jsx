import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getNativeByChain } from "helpers/networks";
import { getCollectionsByChain } from "helpers/collections";
import { useLocation ,Link } from "react-router-dom";
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
} from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin } from "antd";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import {
  FileSearchOutlined,
  RightCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
//import { useFetchExploreCollection } from "hooks/useFetchExploreCollection";
const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
  banner: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: "0 auto",
    width: "600px",
    //borderRadius: "10px",
    height: "150px",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "solid 1px #e3e3e3",
  },
  logo: {
    height: "115px",
    width: "115px",
    borderRadius: "50%",
    // positon: "relative",
    // marginTop: "-80px",
    border: "solid 4px white",
  },
  text: {
    color: "#041836",
    fontSize: "27px",
    fontWeight: "bold",
  },
};

function NFTTokens(props) {
  const history = useHistory();
  useEffect(() => {
    if (!props.loggedStatus) {
      history.push("/NFTMarketPlace");
    }
  }, [history, props.loggedStatus]);
    const nft = useLocation().state.nft
    const Addr = useLocation().state.Address
    const input = useLocation().state.from
 
  const fallbackImg =
  "https://gateway.pinata.cloud/ipfs/QmUYmSukDEp1CFGCBXfGNJfbAdu2m6s89Uns2jtrbgz7Gq"
  const { NFTTokenIds, totalNFTs, fetchSuccess } = useNFTTokenIds(Addr);
  const [visible, setVisibility] = useState(false);
  const [nftToBuy, setNftToBuy] = useState(null);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  //const { exploreCollection} = useFetchExploreCollection();
console.log(NFTTokenIds)
  const { chainId, marketAddress, contractABI, walletAddress } =
    useMoralisDapp();
  const nativeName = getNativeByChain(chainId);
  const contractABIJson = JSON.parse(contractABI);
  const { Moralis } = useMoralis();
  const queryMarketItems = useMoralisQuery("MarketItemCreate");
  const fetchMarketItems = JSON.parse(
    JSON.stringify(queryMarketItems.data, [
      "objectId",
      "createdAt",
      "price",
      "nftContract",
      "itemId",
      "sold",
      "tokenId",
      "seller",
      "owner",
      "confirmed",
    ])
  );
  const queryCollectionItems = useMoralisQuery("Collections");
  const exploreItems = JSON.parse(
     JSON.stringify(queryCollectionItems.data, [
       "objectId",
       "ownerAddress",
       "CollectionName",
       "CollectionAddress",
       "symbol",
       "time",
       "chain",
       "status"
     ])
   ).filter(function(ele){
    return ( ele.chain == chainId ) && (ele.status == true)
   });
  

  
  const purchaseItemFunction = "createMarketSale";
  const NFTCollections = getCollectionsByChain(chainId);
  
  async function purchase() {
    setLoading(true);
    const tokenDetails = getMarketItem(nftToBuy);
    const itemID = tokenDetails.itemId;
    const tokenPrice = tokenDetails.price;
    const ops = {
      contractAddress: marketAddress,
      functionName: purchaseItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: nftToBuy.token_address,
        itemId: itemID,
      },
      msgValue: tokenPrice,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        updateSoldMarketItem();
        succPurchase();
      },
      onError: (error) => {
        setLoading(false);
        failPurchase();
      },
    });
  }

  const handleBuyClick = (nft) => {
    setNftToBuy(nft);
    console.log(nft.image);
    setVisibility(true);
  };

  function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have purchased this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failPurchase() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when purchasing this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  async function updateSoldMarketItem() {
    const id = getMarketItem(nftToBuy).objectId;
    const marketList = Moralis.Object.extend("MarketItemCreate");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("sold", true);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }

 

  const getMarketItem = (nft) => {
    const result = fetchMarketItems?.find(
      (e) =>
        e.nftContract === nft?.token_address &&
        e.tokenId === nft?.token_id &&
        e.sold === false &&
        e.confirmed === true
    );
    return result;
  };

  return (
    <>
      <div>
      {totalNFTs !== undefined && (
          <>
            {!fetchSuccess && (
              <>
                <Alert
                  message="Unable to fetch all NFT metadata... We are searching for a solution, please try again later!"
                  type="warning"
                />
                <div style={{ marginBottom: "10px" }}></div>
              </>
            )}
            <div style={styles.banner}>
              <Image
                preview={false}
                src={NFTTokenIds[0]?.image || "error"}
                fallback={fallbackImg}
                alt=""
                style={styles.logo}
              />
              <div style={styles.text}>
                <>
                  <div>{`${NFTTokenIds[0]?.name}`}</div>
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#4C4F56",
                      fontWeight: "normal",
                    }}
                  >
                    Collection Size: {`${totalNFTs}`}
                  </div>
                </>
              </div>
            </div>
          </>
        )}
        
        
        { input === "userExplore" && totalNFTs !== undefined  && (
          <div style={styles.NFTs}>
          
          {
            NFTTokenIds.map((nft, index) => (
              <Link 
                   to={
                        { pathname : "/NFTDetails/",
                          state : { "nft":nft,
                                   "confirmed" : getMarketItem(nft),
                                    "from" :   "userExplore"
                                  }
                        }
                        
                    }>
              <Card
                hoverable
                actions={[
                  <Tooltip title="View On Blockexplorer">
                    <FileSearchOutlined
                      onClick={() =>
                        window.open(
                          `${getExplorer(chainId)}address/${nft.token_address}`,
                          "_blank"
                        )
                      }
                    />
                  </Tooltip>,
                  <Tooltip title="this from Userexplore Buy NFT">
                    <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
                  </Tooltip>,
                ]}
                style={{ width: 240, border: "2px solid #e7eaf3" }}
                cover={
                  <Image
                    preview={false}
                    src={nft.image || "error"}
                    fallback={fallbackImg}
                    alt=""
                    style={{ height: "240px" }}
                  />
                }
                key={index}
              >
                {getMarketItem(nft) && (
                  
                  <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
                ) }
                <Meta title={nft.metadata.name} description={`#${nft.token_id}`} />
              </Card></Link>
            ))}
            </div>

        ) }
        
        { input !== "userExplore" && totalNFTs  !== undefined && (
             <div style={styles.NFTs}>
          
             {
               NFTTokenIds.map((nft, index) => (
                 <Link 
                      to={
                           { pathname : "/NFTDetails/",
                             state : {"nft":nft ,
                                      "confirmed" : getMarketItem(nft),
                                      "from" :   "explore"
                                    }
                             }
                           
                       }>
                 <Card
                   hoverable
                   actions={[
                     <Tooltip title="View On Blockexplorer">
                       <FileSearchOutlined
                         onClick={() =>
                           window.open(
                             `${getExplorer(chainId)}address/${nft.token_address}`,
                             "_blank"
                           )
                         }
                       />
                     </Tooltip>,
                     <Tooltip title=" this from explore  Buy NFT">
                       <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
                     </Tooltip>,
                   ]}
                   style={{ width: 240, border: "2px solid #e7eaf3" }}
                   cover={
                     <Image
                       preview={false}
                       src={nft.image || "error"}
                       fallback={fallbackImg}
                       alt=""
                       style={{ height: "240px" }}
                     />
                   }
                   key={index}
                 >
                   {getMarketItem(nft) && (
                     <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
                   )}
                   <Meta title={nft.metadata.name} description={`#${nft.token_id}`} />
                 </Card></Link>
               ))}
           </div>
        ) }

        {/* {getMarketItem(nftToBuy) ? (
          <Modal
            title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => purchase()}
            okText="Buy"
          >
            <Spin spinning={loading}>
              <div
                style={{
                  width: "250px",
                  margin: "auto",
                }}
              >
                <Badge.Ribbon
                  color="green"
                  text={`${
                    getMarketItem(nftToBuy).price / ("1e" + 18)
                  } ${nativeName}`}
                >
                  <img
                    src={nftToBuy?.image}
                    style={{
                      width: "250px",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  />
                </Badge.Ribbon>
              </div>
            </Spin>
          </Modal>
        ) : (
          <Modal
            title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => setVisibility(false)}
          >
            <img
              src={nftToBuy?.image}
              style={{
                width: "250px",
                margin: "auto",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
            <Alert
              message="This NFT is currently not for sale"
              type="warning"
            />
          </Modal>
        )} */}
      </div>
    </>
  );
}

export default NFTTokens;
