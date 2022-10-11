
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";

export const useAttribute = (token_uri) => {
 
  const [Attri ,setAttri] = useState([])
  
  useEffect(async () => {
    const options = {method: 'GET', headers: {accept: 'application/json'}};

    try {
      
      await fetch(token_uri).then((res)=>{
        res.json().then((resp)=>{
          
          setAttri(resp.attributes)
        })
          
        
    })
    
    } catch (error) {
      
    }
  },[]);

  return {
    Attri
  };
};
