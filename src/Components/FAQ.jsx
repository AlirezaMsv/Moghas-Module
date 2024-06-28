import { CaretRightOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { Button, Collapse, Divider } from "antd";

const FAQ = ({ items, setShowChat }) => {
  return (
    <>
      <p className="font">
        به لیست سوالات پرتکرار زیر نگاهی بیندازید و اگر سوال شما برطرف نشد،
        می‌توانید با پشتیبان صحبت کنید:
      </p>
      <Divider />
      <Collapse
        expandIconPosition="end"
        accordion
        items={items}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 270 : 180} />
        )}
      />
      <Divider />
      <p className="font">
        در صورت نیاز به اطلاعات بیشتر، پشتیبانان ما آماده پاسخگویی به شما هستند.
      </p>
      <Button
        className="w-full my-4 bg-green-500 font-bold text-white"
        icon={<CustomerServiceOutlined />}
        onClick={() => setShowChat(true)}
      >
        ارتباط با پشتیبان
      </Button>
    </>
  );
};

export default FAQ;
