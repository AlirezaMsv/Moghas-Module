import { Button, ConfigProvider, Divider, Input } from "antd";
import { useState } from "react";
import { postApi } from "./hooks/api";

const NotOnline = ({ intro, messageApi, setShow}) => {

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [EP, setEP] = useState("")

  const handleSend = () => {
    setLoading(true);
    postApi(`api/CustomerSettings/insert-setting`, {
      customerId: localStorage.getItem("customerId"),
      type: "EMAIL",
      key: username,
      value: EP,
    })
      .then((data) => {
        setLoading(false);
        setShow(false)
        messageApi.open({
          type: "success",
          content: "اطلاعات شما ثبت شد",
          style: {
            fontFamily: "VazirFD",
            direction: "rtl",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        messageApi.open({
          type: "error",
          // content: "خطایی رخ داد!",
          content: err.response.data || "خطایی رخ داد!",
          style: {
            fontFamily: "VazirFD",
            direction: "rtl",
          },
        });
        setLoading(false);
      });
  };

  return (
    <ConfigProvider
      theme={{
        components: {},
      }}
    >
      <p className="font">{intro}</p>
      <Divider />
      <div className="w-full flex justify-center flex-col">
        <Input
          className="ml-4 my-2"
          placeholder="نام کاربری"
          style={{
            direction: "ltr",
          }}
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <Input
          className="ml-4 my-2"
          placeholder="ایمیل یا شماره تماس"
          style={{
            direction: "ltr",
          }}
          value={EP}
          onChange={e => setEP(e.target.value)}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="mx-16 my-4 bg-green-500"
          onClick={handleSend}
        >
          ارسال
        </Button>
      </div>
    </ConfigProvider>
  );
};

export default NotOnline;
