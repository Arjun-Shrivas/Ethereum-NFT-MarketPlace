import React, { useState } from "react";
import { Card, Modal } from "antd";
import { MailOutlined, KeyOutlined } from "@ant-design/icons";
import { Input, Button, Form } from "antd";
import styles from "./styles";

export default function Login(props) {
  const [modalMsg, setModalMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [stepForm] = Form.useForm();
  const handleLogin = (values) => {
    console.log(values);
    const email = values["email"];
    const password = values["password"];

    const session = {
      email: email,
      password: password,
      session_token: "abc..",
      };
      localStorage.setItem("sessionData", JSON.stringify(session));
      localStorage.setItem("auth", true);
      props.setSessionToken("abc..");
      props.setLoggedStatus(true);
      props.startSessionTimer();
  };
  const onLoginFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Modal
        title="Registration Status"
        visible={showModal}
        onOk={() => {
          setShowModal(false);
        }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>{modalMsg}</p>
      </Modal>
      <Card style={styles.card}>
        <Form
          form={stepForm}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          labelAlign="left"
          onFinish={handleLogin}
          onFinishFailed={onLoginFailed}
          autoComplete="off"
          size="middle"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Enter your email!",
              },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Enter your password!",
              },
            ]}
          >
            <Input.Password size="large" prefix={<KeyOutlined />} />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            style={{ width: "100%", marginTop: "25px" }}
          >
            Submit
          </Button>
        </Form>
      </Card>
    </>
  );
}
