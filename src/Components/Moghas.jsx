import {
  FloatButton,
  Card,
  Divider,
  ConfigProvider,
  message,
  Button,
} from "antd";
import QueueAnim from "rc-queue-anim";
import { useCallback, useEffect, useState } from "react";
import {
  CommentOutlined,
  DingtalkOutlined,
  DiscordOutlined,
  QuestionCircleOutlined,
  RedditOutlined,
  TwitchOutlined,
  TwitterOutlined,
  WechatOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { getApi } from "./hooks/api";
import FAQ from "./FAQ";
import NotOnline from "./NotOnline";
import Chat from "./Chat";
import img from "../assets/imgs/support.png";
import RateChat from "./RateChat";

function Moghas() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState();
  const [isOnline, setIsOnline] = useState();
  const [size, setSize] = useState("");
  const [icon, setIcon] = useState();
  const [chat_background, setChat_background] = useState("");
  const [showFAQFirst, setShowFAqFirst] = useState();
  const [position, setPosition] = useState();
  const [icon_backgroundColor, setIcon_backgroundColor] = useState();
  const [iconColor, setIconColor] = useState();
  const [intro, setIntro] = useState();
  const [shape, setShape] = useState();
  const [status, setStatus] = useState();
  const [title, setTitle] = useState();
  const [requireUsername, setRequireUsername] = useState();
  const [FAQs, setFAQs] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [chatId, setChatId] = useState(null);
  const [showEndChat, setShowEndChat] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const { Meta } = Card;

  const iconStyle = {
    color: iconColor,
    fontSize:
      size === "large" ? "2rem" : size === "medium" ? "1.5rem" : "1.2rem",
  };

  useEffect(() => {
    setLoading(true);
    getApi(
      `api/CustomerSettings/get-setting?customerId=${localStorage.getItem(
        "customerId"
      )}&type=UI`
    )
      .then((data) => {
        data.map((e) => {
          switch (e.key) {
            case "icon_backgroundColor":
              setIcon_backgroundColor(e.value);
              break;
            case "iconColor":
              setIconColor(e.value);
              break;
            case "size":
              setSize(e.value);
              break;
            case "position":
              setPosition(e.value);
              break;
            case "shape":
              setShape(e.value);
              break;
            case "title":
              setTitle(e.value);
              break;
            case "status":
              setStatus(e.value);
              break;
            case "intro":
              setIntro(e.value);
              break;
            case "chat_background":
              setChat_background(e.value);
              break;
            case "showFaqFirst":
              setShowFAqFirst(e.value === "true" ? true : false);
              break;
            case "requireUsername":
              setRequireUsername(e.value === "true" ? true : false);
              break;
            case "requirePhone":
              setIsOnline(e.value === "true" ? true : false);
              break;
            case "icon":
              setIcon(e.value);
              break;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // fetch faq
    if (showFAQFirst) {
      getApi(
        `api/CustomerSettings/get-setting?customerId=${localStorage.getItem(
          "customerId"
        )}&type=FAQ`
      )
        .then((data) => {
          const arr = [];
          data.map((q, i) => {
            arr.push({
              key: `${i}`,
              label: q.key,
              children: <p>{q.value}</p>,
            });
          });
          setFAQs(arr);
          setLoading(false);
          setRefresh((prev) => !prev);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [showFAQFirst]);

  const handleEndChat = () => {
    setShowRate(true);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    if (localStorage.getItem("chatId") && localStorage.getItem("username")) {
      setShowChat(true);
      setChatId(localStorage.getItem("chatId"));
      setRefresh((prev) => !prev);
    }
  }, []);

  const showContent = useCallback(() => {
    if (showRate) {
      return (
        <RateChat
          messageApi={messageApi}
          close={() => setShow(false)}
          setShowChat={setShowChat}
          setRefresh={setRefresh}
          showRate={showRate}
        />
      );
    }
    if (showChat || (isOnline && !showFAQFirst)) {
      return (
        <Chat
          requireUsername={requireUsername}
          setShowEndChat={setShowEndChat}
          chat_background={chat_background}
          messageApi={messageApi}
          chatId={chatId}
          setChatId={setChatId}
          showRate={showRate}
        />
      );
    }
    if (!isOnline) {
      return (
        <NotOnline intro={intro} messageApi={messageApi} setShow={setShow} />
      );
    }
    if (showFAQFirst) {
      return (
        <FAQ
          items={FAQs}
          setShowChat={setShowChat}
          messageApi={messageApi}
          setRefresh={setRefresh}
        />
      );
    }
  }, [refresh]);

  const getIcon = () => {
    switch (icon) {
      case "QuestionCircleOutlined":
        return <QuestionCircleOutlined style={iconStyle} />;
      case "WechatOutlined":
        return <WechatOutlined style={iconStyle} />;
      case "DiscordOutlined":
        return <DiscordOutlined style={iconStyle} />;
      case "TwitchOutlined":
        return <TwitchOutlined style={iconStyle} />;
      case "CommentOutlined":
        return <CommentOutlined style={iconStyle} />;
      case "WhatsAppOutlined":
        return <WhatsAppOutlined style={iconStyle} />;
      case "TwitterOutlined":
        return <TwitterOutlined style={iconStyle} />;
      case "DingtalkOutlined":
        return <DingtalkOutlined style={iconStyle} />;
      case "RedditOutlined":
        return <RedditOutlined style={iconStyle} />;
    }
  };

  const lightenColor = (hex, percent) => {
    if (hex) {
      // Convert hex to RGB
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);

      // Increase each channel by the given percentage
      r = Math.min(255, Math.floor(r + ((255 - r) * percent) / 100));
      g = Math.min(255, Math.floor(g + ((255 - g) * percent) / 100));
      b = Math.min(255, Math.floor(b + ((255 - b) * percent) / 100));

      // Convert back to hex
      r = r.toString(16).padStart(2, "0");
      g = g.toString(16).padStart(2, "0");
      b = b.toString(16).padStart(2, "0");

      return `#${r}${g}${b}`;
    }
  };

  // Update CSS variables
  const customStyle = {
    "--float-btn-width": `${
      size === "large" ? 3.5 : size === "medium" ? 3 : 2.5
    }rem`,
    "--float-btn-height": `${
      size === "large" ? 3.5 : size === "medium" ? 3 : 2.5
    }rem`,
  };

  return loading ? (
    <></>
  ) : (
    <ConfigProvider
      theme={{
        components: {
          FloatButton: {
            colorPrimary: icon_backgroundColor,
            colorPrimaryHover: lightenColor(icon_backgroundColor, 20),
            paddingXXS: 0,
          },
          Collapse: {
            fontFamily: "VazirFD",
          },
          Card: {
            fontFamily: "VazirFD",
          },
          Button: {
            fontFamily: "VazirFD",
          },
          Rate: {
            fontFamily: "VazirFD",
          },
        },
      }}
    >
      {contextHolder}
      <FloatButton.Group
        open={show}
        type="primary"
        trigger="click"
        shape={shape}
        onClick={() => setShow((prev) => !prev)}
        style={{
          ...customStyle,
          bottom: 24,
          ...(position === "right" ? { right: 24 } : { left: 24 }),
        }}
        icon={getIcon()}
      />
      <QueueAnim
        animConfig={[
          { opacity: [1, 0], translateY: [0, 50] },
          { opacity: [1, 0], translateY: [0, -50] },
        ]}
      >
        {show ? (
          <Card
            key="a"
            extra={
              showRate ? (
                <Button
                  onClick={() => {
                    setShowRate(false);
                    setShowChat(true)
                    setRefresh(prev => !prev)
                  }}
                  className="bg-blue-400"
                >
                  بازگشت
                </Button>
              ) : showEndChat ? (
                <Button onClick={handleEndChat} className="bg-red-400">
                  پایان چت
                </Button>
              ) : (
                <></>
              )
            }
            // bordered={false}
            style={{
              position: "fixed",
              width: 450,
              direction: "rtl",
              height: 550,
              bottom: 24,
              zIndex: 10,
              overflowY: "scroll",
              ...(position === "right" ? { right: 80 } : { left: 80 }),
            }}
          >
            <Meta
              title={title}
              description={status}
              avatar={<img src={img} className="w-16" />}
            />
            <Divider />
            {showContent()}
          </Card>
        ) : (
          <></>
        )}
      </QueueAnim>
    </ConfigProvider>
  );
}

export default Moghas;
