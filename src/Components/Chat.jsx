import { Button, ConfigProvider, Input, message } from "antd";
import { useEffect, useState } from "react";
import { postApi } from "./hooks/api";
import { ProChat } from "@ant-design/pro-chat";
import { SendOutlined } from "@ant-design/icons";

const Chat = ({ requireUsername, chat_background, messageApi }) => {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const handleStartChat = () => {
    if (requireUsername && username.trim() === "") {
      messageApi.open({
        type: "warning",
        content: "نام کاربری خود را وارد کنید!",
        style: {
          fontFamily: "VazirFD",
          direction: "rtl",
        },
      });
      return;
    }
    setLoading(true);
    postApi(
      `api/Chat/start-chat?configUsername=${localStorage.getItem(
        "configUsername"
      )}&configPassword=${localStorage.getItem(
        "configPassword"
      )}&username=${username}`
    )
      .then((data) => {
        localStorage.setItem("chatId", data);
        setShowChat(true);
        setLoading(false);
        // postApi(
        //   `api/Chat/email-new-chat?customerId=${localStorage.getItem(
        //     "customerId"
        //   )}`
        // );
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        messageApi.open({
          type: "error",
          content: "خطایی رخ داد!",
          style: {
            fontFamily: "VazirFD",
            direction: "rtl",
          },
        });
      });
  };

  const handleSendMessage = () => {
    setMessageLoading(true);
    postApi(
      `api/Chat/send-user-message?chatId=${localStorage.getItem(
        "chatId"
      )}&message=${text}`
    )
      .then((data) => {
        const arr = [];
        messages.map((c) => arr.push(c));
        arr.push({
          role: "user",
          content: text,
          loading: false,
          id: arr.length,
        });
        setText("");
        setMessages(arr);
        setMessageLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        messageApi.open({
          type: "error",
          content: "خطایی رخ داد!",
          style: {
            fontFamily: "VazirFD",
            direction: "rtl",
          },
        });
      });
  };

  return showChat ? (
    <div style={{ background: chat_background }}>
      <ProChat
        // loading={messageLoading}
        helloMessage="بفرمایید!"
        chats={messages}
        style={{
          height: "50vh",
        }}
        inputRender={() => {
          return (
            <Input.TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="پیام خود را بنویسید"
            />
          );
        }}
        sendButtonRender={() => {
          return (
            <Button
              loading={messageLoading}
              onClick={handleSendMessage}
              className="mx-2"
              icon={<SendOutlined />}
            />
          );
        }}
      />
    </div>
  ) : (
    <div className="w-full flex justify-center flex-col">
      <Input
        className="ml-4 my-2"
        placeholder="نام کاربری"
        style={{
          direction: "ltr",
        }}
        required={requireUsername}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        className="mx-16 my-4 bg-green-500"
        onClick={handleStartChat}
      >
        شروع چت
      </Button>
    </div>
  );
};

export default Chat;
