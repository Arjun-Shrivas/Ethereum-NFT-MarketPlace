
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";

export const useGetUserCollection = (addr) => {
  const { chainId } = useMoralisDapp();
  const [TotalSize, setTotalSize] = useState();
  const [PageSize, setPageSize] = useState();
  const [OwnerCollection, setOwnerCollection] = useState([]);
  useEffect(async () => {
    const options = {method: 'GET', headers: {accept: 'application/json', 'X-API-Key': 'test'}};

    try {
      
      await fetch(`https://deep-index.moralis.io/api/v2/${addr}/nft/collections?chain=goerli`, options)
      .then(response => response.json())
      .then(data => {
          
        
        setOwnerCollection(data.result);
        setTotalSize(data.total);
        setPageSize(data.page_size);

        
       
      });
    } catch (error) {
      
    }
  },[]);

  return {
    OwnerCollection,
    TotalSize,
    PageSize
  };
};
