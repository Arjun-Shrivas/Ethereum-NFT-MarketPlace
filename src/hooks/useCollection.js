import { useMoralisQuery } from "react-moralis";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
 
export const useCollection = ()=>{
  const { chainId } = useMoralisDapp();
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

 return (exploreItems)

}




