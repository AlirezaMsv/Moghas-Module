import { FloatButton, Card, Divider, Collapse } from "antd";
import QueueAnim from "rc-queue-anim";
import { useEffect, useState } from "react";
import {
  QuestionCircleOutlined,
  PlusOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { getApi } from "./hooks/api";

function Moghas() {
  const [showFAQ, setShowFAQ] = useState(false);
  const { Meta } = Card;

  useEffect(() => {
    getApi(`api/CustomerSettings/get-setting?customerId=17&type=FAQ`)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const items = [
    {
      key: "1",
      label: "چه نوع اسنادی می‌توان در سیستم مدیریت اسناد ذخیره کرد؟",
      children: (
        <p>
          سیستم مدیریت اسناد قادر است تمامی نوع اسناد را ذخیره کند، از جمله
          اسناد متنی، تصاویر، فایل‌های صوتی و ویدیویی و ...
        </p>
      ),
    },
    {
      key: "2",
      label: "آیا سیستم مدیریت اسناد به شبکه اینترنت متصل است؟",
      children: (
        <p>
          بله، سیستم مدیریت اسناد معمولاً به شبکه اینترنت متصل است تا کاربران
          بتوانند به راحتی به اطلاعات دسترسی پیدا کنند و با همکاران خود در سراسر
          جهان ارتباط برقرار کنند.
        </p>
      ),
    },
    {
      key: "3",
      label: "استفاده از سیستم مدیریت اسناد چه مزایایی دارد؟",
      children: (
        <p>
          استفاده از سیستم مدیریت اسناد دارای مزایای زیادی است، از جمله:
          <br />
          - افزایش بهره‌وری و کارآیی سازمان
          <br />
          - کاهش هزینه‌های مربوط به ذخیره سازی و نگهداری اسناد
          <br />
          - بهبود دسترسی به اطلاعات
          <br />- حفاظت از اطلاعات و جلوگیری از دسترسی غیرمجاز به آن‌ها
        </p>
      ),
    },
  ];

  return (
    <>
      <FloatButton.Group
        open={showFAQ}
        type="primary"
        trigger="click"
        onClick={() => setShowFAQ((prev) => !prev)}
        style={{ right: 24, bottom: 24 }}
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton icon={<PlusOutlined />} />
      </FloatButton.Group>
      <QueueAnim
        animConfig={[
          { opacity: [1, 0], translateY: [0, 50] },
          { opacity: [1, 0], translateY: [0, -50] },
        ]}
      >
        {showFAQ ? (
          <Card
            key="a"
            // bordered={false}
            style={{
              position: "fixed",
              width: 300,
              height: 500,
              bottom: 24,
              right: 70,
              zIndex: 10,
              overflowY: "scroll",
            }}
          >
            <Meta
              title="سوالات پرتکرار"
              description="در صورتی که سوال مورد نظر خود را پیدا نکردید. میتوانید با زدن دکمه + سوال خود را بپرسید"
            />
            <Divider />
            <Collapse
              expandIconPosition="end"
              accordion
              items={items}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 270 : 180} />
              )}
            />
          </Card>
        ) : (
          <></>
        )}
      </QueueAnim>
    </>
  );
}

export default Moghas;
