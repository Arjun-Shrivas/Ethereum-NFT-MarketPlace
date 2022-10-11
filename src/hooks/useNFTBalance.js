import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTBalance = (options) => {
  const { account } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [NFTBalance, setNFTBalance] = useState([]);
  const {
    fetch: getNFTBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTs, { chain: chainId, ...options });
  const [fetchSuccess, setFetchSuccess] = useState(true);
  

  useEffect(async () => {
    if (data?.result) {
      const NFTs = data.result;
      console.log("data nft : ",NFTs)
      
      for (let nft of NFTs) {
        if (nft?.metadata) {
          setFetchSuccess(true);
          nft.metadata = JSON.parse(nft.metadata);
          nft.image = resolveLink(nft.metadata?.image);
          setNFTBalance(NFTBalance => [...NFTBalance, nft])

         }
         // else if (NFT?.token_uri) {
//           try {
//             await fetch(NFT.token_uri)
//               .then((response) => response.json())
//               .then((data) => {
//                 NFT.image = resolveLink(data.image);
//               });
//           } catch (error) {
//             setFetchSuccess(false);

// /*          !!Temporary work around to avoid CORS issues when retrieving NFT images!!
//             Create a proxy server as per https://dev.to/terieyenike/how-to-create-a-proxy-server-on-heroku-5b5c
//             Replace <your url here> with your proxy server_url below
//             Remove comments :)

//               try {
//                 await fetch(`<your url here>/${NFT.token_uri}`)
//                 .then(response => response.json())
//                 .then(data => {
//                   NFT.image = resolveLink(data.image);
//                 });
//               } catch (error) {
//                 setFetchSuccess(false);
//               }

//  */
//           }
//         }
      }
    

     
    
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getNFTBalance, NFTBalance, fetchSuccess, error, isLoading };
};
