import { useEffect, useState, useRef} from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import Account from "components/Account";
import Login from "components/Login/Login";
import Home from "components/Home";
import Register from "components/Register/Register";
import Chains from "components/Chains";
import NFTBalance from "components/NFTBalance";

import ExploreMarket from "components/ExploreMarket";
import NFTTokens from "components/NFTTokens";

import MyNFTCollection from "components/MyNFTCollection";
import NFTint from "components/NFTMint/Create"
import { Menu, Layout, Modal, Button, Tabs, Divider } from "antd";
import SearchCollections from "components/SearchCollections";
import "antd/dist/antd.css";
import { UserOutlined } from "@ant-design/icons";
import NativeBalance from "components/NativeBalance";
import NFTDetails from "components/NFTDetails";
import TestColl from "components/UserCollection";
import Profile from "components/Profile/Profile";
import "./style.css";
import logo from "./images/bcs-logo.png";
// import Text from "antd/lib/typography/Text";
import NFTMarketTransactions from "components/NFTMarketTransactions";
import LoadingSpinner from "uikit/Spinner/LoadingSpinner";
import CheckLoggedStatus from "./components/Login/CheckLogin";
const { Header } = Layout;

const styles = {
  content: {
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    margin: "70px 0px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
    backgroundColor: "#001529",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const [sessionToken, setSessionToken] = useState(CheckLoggedStatus()[1]);
  const [loggedStatus, setLoggedStatus] = useState(CheckLoggedStatus()[0]);
  const [checkLogged, setCheckLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChain, setCurrentChain] = useState("");
  const [selectedChain, setSelectedChain] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const sessionTimedOut = useRef(null);
  const [isLogOut, setLogOut] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  const [inputValue, setInputValue] = useState("explore");

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  const handleLogout = () => {
    const token = JSON.parse(localStorage.getItem("sessionData"));
    console.log("token===>", token);
    setLoggedStatus(false);
    localStorage.removeItem("sessionData");
    localStorage.removeItem("auth");
    setLogOut(false);
    setSessionToken(null);
    setIsProfileModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    clearTimeout(sessionTimedOut.current);
    handleLogout();
  };

  const handleCancel = () => {
    start();
    clearTimeout(sessionTimedOut.current);
    setIsModalVisible(false);
  };
  const timeout = 300000;
  const onActive = (e) => {
    start();
    clearTimeout(sessionTimedOut.current);
    console.log("user is active", e);
  };

  const onIdle = (e) => {
    console.log("user is idle", e);
    showModal();
    sessionTimedOut.current = setTimeout(handleOk, 60000);
  };

  // eslint-disable-next-line no-unused-vars
  const { idleTimer, start } = useIdleTimer({
    onIdle,
    onActive,
    timeout,
    startManually: true,
    stopOnIdle: true,
  });

  return (
    <Layout style={{ 
      height: "100vh", 
      overflow: "auto", 
      backgroundColor: "rgb(242 231 240)",
      backgroundImage: "radial-gradient(at 0% 0%, rgb(223 197 251) 0px, transparent 50%), radial-gradient(at 50% 0%, rgb(182 180 239) 0px, transparent 50%), radial-gradient(at 100% 0%, rgb(253, 232, 240) 0px, transparent 50%)",
    }}>

      <Modal
        title="Session timed out"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Log out"
        cancelText="Stay"
      >
        Your session will be logged out in 60s
      </Modal>

      <Modal
        title="Session timed out"
        visible={isLogOut}
        onOk={handleLogout}
        onCancel={handleLogout}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Log out"
      >
        Session expired. Please login again
      </Modal>

      <Router>
        <Header style={styles.header}>
          <Logo />
          {loggedStatus && (
            <>
              <SearchCollections setInputValue={setInputValue}/>
              <Menu
                theme="light"
                mode="horizontal"
                style={{
                  display: "flex",
                  fontSize: "17px",
                  fontWeight: "500",
                  marginLeft: "10px",
                  width: "100%",
                  backgroundColor: "#001529",
                }}
                defaultSelectedKeys={["nftMarket"]}
              >
                <Menu.Item key="nftMarket" onClick={() => setInputValue("explore")} >
                  <NavLink to="/NFTMarketPlace">🛒 Explore Market</NavLink>
                </Menu.Item>

                <Menu.Item key="NFTMint"  >
                  <NavLink to="/NFTMint">💸 Mint NFT</NavLink>
                </Menu.Item>

                <Menu.Item key="myCollection">
                  <NavLink to="/myCollection">📚 My Collection</NavLink>
                </Menu.Item>

                <Menu.Item key="Profile">
                  <NavLink to="/Profile"><UserOutlined />Profile</NavLink>
                </Menu.Item>
              </Menu>
              <div style={styles.headerRight}>
                <Chains />
                <NativeBalance />
                <Account />
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <div onClick={() => setIsProfileModalVisible(true)}>
                    <Button className="btn" title="User">
                      <UserOutlined
                        style={{ fontSize: "18px", color: "rgb(255 255 255)", padding: "0px 4px" }}
                      />
                    </Button>
                  </div>
                  <Modal
                    visible={isProfileModalVisible}
                    footer={null}
                    onCancel={() => setIsProfileModalVisible(false)}
                    bodyStyle={{
                      padding: "15px",
                      fontSize: "17px",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                    style={{ fontSize: "16px", fontWeight: "500" }}
                    width="340px"
                  >
                    <a className="anchor-text" href="#">
                      Terms and Condition.
                    </a>
                    <Divider/>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => handleLogout()}
                      style={{ width: "50%", "border-radius": "12px" }}
                    >
                      Logout
                    </Button>
                  </Modal>
                </div>
              </div>
              <div>{isLoading ? <LoadingSpinner /> : null}</div>
            </>
          )}
        </Header>

        <div style={styles.content}>
        <div>{isLoading ? <LoadingSpinner /> : null}</div>
          <Switch>
            <Route path="/login">
              <Tabs defaultActiveKey="1" style={{ alignItems: "center" }}>
                <Tabs.TabPane tab={<span>Login</span>} key="1">
                  <Login />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<span>Register</span>} key="2">
                  <Register />
                </Tabs.TabPane>
              </Tabs>
            </Route>

            <Route
              path="/NFTMarketPlace"
              render={(props) => (
                <Home
                  {...props}
                  startSessionTimer={start}
                  currentChain={currentChain}
                  checkLogged={checkLogged}
                  setCheckLogged={setCheckLogged}
                  loggedStatus={loggedStatus}
                  setLoggedStatus={setLoggedStatus}
                  setSessionToken={setSessionToken}
                  setLogOut={setLogOut}
                  sessionToken={sessionToken}
                  inputValue={inputValue} 
                  setInputValue={setInputValue}
                />
              )}
            />

            <Route path="/nftBalance">
              <NFTBalance 
                loggedStatus={loggedStatus} />
            </Route>
            <Route path="/Transactions">
              <NFTMarketTransactions
                loggedStatus={loggedStatus} />
            </Route>
            <Route path="/NFTMint">
              <NFTint 
                loggedStatus={loggedStatus}/>
            </Route>
            <Route path="/TestColl">
              <TestColl setInputValue={setInputValue}/> 
            </Route>
            <Route path="/NFTDetails/" 
              render={props=>(
                <NFTDetails  
                  {...props}
                  loggedStatus={loggedStatus}
                />
              )}
            >
            </Route>
            <Route path="/myCollection">
              <MyNFTCollection
                loggedStatus={loggedStatus}  />
            </Route>
            <Route path="/Profile">
              <Profile 
                loggedStatus={loggedStatus}/>
            </Route>

            <Route path="/NftTokens" 
              render={props=>(
                <NFTTokens
                  {...props}
                  loggedStatus={loggedStatus}
                />
              )}
            > 
            </Route>
          </Switch>
          <Route exact path="/">
            <Redirect to="/NFTMarketPlace" />
          </Route>
        </div>
      </Router>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <NavLink to="/NFTMarketPlace">
      <img src={logo} alt="logo" className="w-60-cursor-pointer" />
    </NavLink>
  </div>
);

export default App;
