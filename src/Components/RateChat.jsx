import React, { useState } from "react";
import { Divider, Rate, Spin } from "antd";
import { putApi } from "./hooks/api";

const desc = ["خیلی بد", "بد", "متوسط", "خوب", "عالی"];

const RateChat = ({ messageApi, close, setShowChat, setRefresh, showRate }) => {
  const [loading, setLoading] = useState(false);

  const handleSendRate = (rate) => {
    putApi(`api/Chat/end-chat?chatId=${localStorage.getItem("chatId")}`)
      .then((data) => {
        putApi(
          `api/Chat/submit-rate?chatId=${localStorage.getItem(
            "chatId"
          )}&rate=${rate}`
        ).then((data) => {
          localStorage.removeItem("chatId");
          localStorage.removeItem("username");
          messageApi.open({
            type: "success",
            content: "با موفقیت ارسال شد",
            style: {
              fontFamily: "VazirFD",
              direction: "rtl",
            },
          });
          setTimeout(() => {
            setShowChat(false);
            showRate(false);
            close();
            setRefresh((prev) => !prev);
          }, 1000);
        });
      })
      .catch((err) => {
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

  return (
    <div className="w-full flex flex-col align-center">
      {loading ? (
        <Spin />
      ) : (
        <>
          <p className="font">به پشتیبانی از 1 تا 5 امتیاز بدهید</p>
          <Divider />
          <Rate
            style={{ direction: "ltr" }}
            tooltips={desc}
            onChange={(r) => handleSendRate(r)}
          />
        </>
      )}
    </div>
  );
};
export default RateChat;
