import { Button, Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { getApi, postApi } from "./hooks/api";
import { ProChat } from "@ant-design/pro-chat";
import { SendOutlined } from "@ant-design/icons";

const Chat = ({
  requireUsername,
  chat_background,
  messageApi,
  chatId,
  setShowEndChat,
}) => {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessageId, setLastMessageId] = useState();
  const [tourContent, setTourContent] = useState();
  const [showTourBtn, setShowTourBtn] = useState(false);

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
        localStorage.setItem("username", username);
        setShowChat(true);
        setShowEndChat(true);
        setLoading(false);
        postApi(
          `api/Chat/email-new-chat?customerId=${localStorage.getItem(
            "customerId"
          )}`
        );
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

  const handleMessages = (mess) => {
    if (mess.startsWith("tour")) {
      setShowTourBtn(true);
      setTourContent(mess.slice(mess.indexOf("[")))
      return "```tour\n" + mess.slice(4, mess.indexOf("[")) + "\n```";
    } else {
      return mess;
    }
  };

  const listenForNewMessage = () => {
    getApi(`api/Chat/get-last-message?chatId=${localStorage.getItem("chatId")}`)
      .then((data) => {
        if (
          data.id !== lastMessageId &&
          !loading &&
          !messageLoading &&
          data.sender !== localStorage.getItem("username")
        ) {
          setLoading(true);

          // Use the setter function to update messages
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              role: "user",
              content: handleMessages(data.text),
              loading: false,
              id: data.id,
            },
          ]);

          setLastMessageId(data.id);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (showChat && !loading) {
      const intervalId = setInterval(listenForNewMessage, 1000);
      return () => clearInterval(intervalId); // Clear interval on cleanup
    }
  }, [showChat, loading]); // Add necessary dependencies

  useEffect(() => {
    if (chatId) {
      setShowChat(true);
      setShowEndChat(true);
      setLoading(true);
      getApi(`api/Chat/get-all-messages?chatId=${chatId}`)
        .then((data) => {
          const arr = [];
          data.map((m, i) => {
            if (i === data.length - 1) {
              setLastMessageId(m.id);
            }
            arr.push({
              role:
                m.sender === localStorage.getItem("username")
                  ? "system"
                  : "user",
              content: m.message,
              loading: false,
              id: m.id,
            });
          });
          setMessages(arr);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          messageApi.open({
            type: "error",
            content: "خطایی رخ داد!",
            style: {
              fontFamily: "VazirFD",
              direction: "rtl",
            },
          });
        });
    }
  }, []);

  const handleSendMessage = () => {
    setMessageLoading(true);
    postApi(`api/Chat/send-user-message`, {
      chatId: localStorage.getItem("chatId"),
      message: text,
    })
      .then((data) => {
        const arr = [];
        messages.map((c) => arr.push(c));
        arr.push({
          role: "system",
          content: text,
          loading: false,
          id: data,
        });
        setText("");
        setMessages(arr);
        setMessageLoading(false);
        setLastMessageId(data);
      })
      .catch((err) => {
        setMessageLoading(false);
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

  const showTour = () => {
    
  }

  return showChat ? (
    <div style={{ background: chat_background }}>
      <ProChat
        loading={loading}
        helloMessage="بفرمایید!"
        chats={messages}
        style={{
          height: "50vh",
        }}
        inputRender={() => {
          return showTourBtn ? (
            <Button onClick={showTour} className="w-full bg-orange-400 text-white">
              نمایش تور
            </Button>
          ) : (
            <Input.TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="پیام خود را بنویسید"
            />
          );
        }}
        sendButtonRender={() => {
          return (
            <Tooltip title="ارسال پیام">
              <Button
                loading={messageLoading}
                onClick={handleSendMessage}
                className="mx-2"
                icon={
                  <SendOutlined rotate={180} className="hover:text-green-500" />
                }
              />
            </Tooltip>
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
