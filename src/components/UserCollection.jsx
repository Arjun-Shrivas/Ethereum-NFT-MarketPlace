import React from "react";

import { useHistory ,Link } from "react-router-dom";

import {
  useMoralis
} from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin } from "antd";
import { useGetUserCollection } from "hooks/useGetUserCollection";
import {
   RightCircleOutlined,
} from "@ant-design/icons";
const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "center",
    margin: "0 auto",
    maxWidth: "100%",
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

function UserCollection( { setInputValue }) {
    const { Meta } = Card;
    const {user } = useMoralis();
    const history = useHistory();
    const { OwnerCollection , TotalSize , PageSize } = useGetUserCollection(user.get("ethAddress"));
    const fallbackImg =
    "https://gateway.pinata.cloud/ipfs/QmUYmSukDEp1CFGCBXfGNJfbAdu2m6s89Uns2jtrbgz7Gq"
    

    console.log("user collection ",OwnerCollection)
 
    const onChange = (nft) => {
      
        // setInputValue(nft.token_address)
        // let path = "/NFTMarketPlace";
        // history.push(path);
        console.log("check :",nft.token_address);
         
      
      }
  return (
    <>
      <div>
        
        <div style={styles.NFTs}>
          {OwnerCollection.map((nft, index) => (
            
               ( nft.name && nft.symbol )?(
                <Link to={
                  { pathname : "/NftTokens/",
                      state : {"nft":nft,
                               "Address" : nft.token_address,
                               "from" :"userExplore" }
                    }
                  
                  }>
               <Card
                hoverable
                actions={[
                  <Tooltip title="View Collection">
                    <RightCircleOutlined
                      onClick={() => onChange(nft)}
                    />
                  </Tooltip>,
                ]}
                style={{ width: 240, border: "2px solid #e7eaf3" }}
                cover={
                  <Image
                    preview={false}
                    src={nft?.image || "error"}
                    fallback={fallbackImg}
                    alt=""
                    style={{ height: "240px" }}
                  />
                }
                key={index}
              >
                <Meta title={nft.name} />
              </Card>
              </Link>
              ):<div></div>
              
            
            ))}

        
        </div>
      
      </div>
    </>
  );
}

export default UserCollection;
