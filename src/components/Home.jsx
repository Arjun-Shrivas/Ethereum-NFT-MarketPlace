import React from "react";
import { Card } from "antd";
import Login from "components/Login/Login";
import Register from "components/Register/Register";
import { Tabs } from "antd";
import "antd/dist/antd.css";
import ExploreMarket from "components/ExploreMarket";
export default function Home(props) {
  return (
    <div
      style={{
        margin: "auto",
        display: "grid",
        gap: "20px",
        marginTop: "25",
        width: "100%",
        justifyContent: "center",
      }}
    >
      {props.loggedStatus ? (
        <ExploreMarket {...props} />
      ) : (
        <Card
          size="large"
          style={{
            // width: "40%",
            boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
            border: "1px solid #e7eaf3",
            borderRadius: "0.5rem",
          }}
        >
          <div className="flex flex-1 justify-start flex-col mf:mr-10">
            <Tabs defaultActiveKey="1" style={{ alignItems: "center" }}>
              <Tabs.TabPane tab={<span>Login</span>} key="1">
                <Login {...props} />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>Register</span>} key="2">
                <Register {...props} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Card>
      )}
    </div>
  );
}
