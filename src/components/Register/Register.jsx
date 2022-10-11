import React, { useState } from "react";
import { Card, Modal } from "antd";
import { UserOutlined, KeyOutlined, MailOutlined } from "@ant-design/icons";
import { Input, Button, Form } from "antd";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "600",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "1rem",
    fontSize: "16px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    outline: "none",
    fontSize: "16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textverflow: "ellipsis",
    appearance: "textfield",
    color: "#041836",
    fontWeight: "700",
    border: "none",
    backgroundColor: "transparent",
  },
  select: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
  },
  textWrapper: { maxWidth: "80px", width: "100%" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexDirection: "row",
  },
};

export default function Register() {
  const [modalMsg, setModalMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [stepForm] = Form.useForm();

  const handleRegister = (values) => {
    console.log(values);
    const email = values["email"];
    const username = values["username"];
    const password = values["password"];

    setModalMsg("Registration Successful");
    setShowModal(true);
  };

  const handleOk = () => setShowModal(false);
  const onRegisterFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Modal
        title="Registration Status"
        visible={showModal}
        onOk={handleOk}
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
          onFinish={handleRegister}
          onFinishFailed={onRegisterFailed}
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
              {
                type: "email",
                message: "Enter a valid E-mail!",
              },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Enter your name!",
              },
            ]}
          >
            <Input size="large" prefix={<UserOutlined />} />
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
