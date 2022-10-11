import {React , useState, useEffect} from "react";
import { useMoralis } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useHistory } from "react-router-dom";
import { getEllipsisTxt } from "helpers/formatters";
import { TableOutlined} from "@ant-design/icons";
import { Avatar ,Card } from "antd";
import "./Profile.scss"
import "./app.css"
import banner from "./curved0.jpg"
import profilePic from "./rocket-white.png"

import  NFTBalance  from "../NFTBalance"
import NFTMarketTransactions from "../NFTMarketTransactions";



function Profile(props) {
  const history = useHistory();
  useEffect(() => {
    if (!props.loggedStatus) {
      history.push("/NFTMarketPlace");
    }
  }, [history, props.loggedStatus]);
  const { walletAddress, chainId } = useMoralisDapp();
  const { authenticate, isAuthenticated, logout } = useMoralis();

  const createCollectionClick = () => {
        console.log("createCollectionClick...")
        let path = "/NFTMint";
        history.push(path);
    };
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

    return (
             <div className="MianProfileDiv">

                <div className="profileContainer">
                  <div className="top-portion">

                        <div className="user-profile-bg-image">
                            <img id="prf-bg-img" src={banner} alt=""  srcSet="" />
                        </div>
                  
                        <div  className="user-profile-img">
                        <img id="prf-img" src={profilePic} alt=""  srcSet="" />
                        {!isAuthenticated && (
                          <div className="username">
                          unamed
                          </div>
                        )

                        }
                        {isAuthenticated && (
                          <div className="username">
                          {getEllipsisTxt(walletAddress, 6)}
                          </div>
                        )

                        }
                       
                        </div>
                        
                  </div>
                  
                  <div className="bottom-portion" >
                  <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          {/* <TableOutlined className="anticon-table"/>NFT Collections */}
          📚 NFT Collections
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          📑 Transactions Details
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          ➕ More
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
         <NFTBalance/>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
           <NFTMarketTransactions />
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          <h2>Content 3</h2>
          <hr />
          <p>
          under construction
          </p>
        </div>
      </div>
    </div>
                  </div>  

                </div>

                


             </div>
        );
}

export default Profile;
