import MyRoutes from "./MyRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Moghas from "./Moghas/Components/Moghas";
import { useEffect, useState } from "react";
import { Button, ConfigProvider, Tour } from "antd";

function App() {
  const [openTour, setOpenTour] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);

  useEffect(() => {
    fetch(window.location.pathname.split("/")[1] + "/environment.json").then(
      (r) =>
        r.json().then((data) => {
          // server url
          window.publicUrl = data.publicUrl;
          localStorage.setItem("publicUrl", data.publicUrl);
          // config username
          window.configUsername = data.configUsername;
          localStorage.setItem("configUsername", data.configUsername);
          // config password
          window.configPassword = data.configPassword;
          localStorage.setItem("configPassword", data.configPassword);
          // customer id
          window.customerId = data.customerId;
          localStorage.setItem("customerId", data.customerId);
        })
    );
  }, []);

  return (
    <div className="App">
      <Moghas setOpenTour={setOpenTour} setTourSteps={setTourSteps} />
      <ConfigProvider
      theme={{
        components:{
          Tour:{
            fontFamily: "VazirFD",
            primaryPrevBtnBg: "#27ae60"
          },
          Button:{
            fontFamily: "VazirFD"
          }
        }
      }}>
        <Tour
          open={openTour}
          onClose={() => setOpenTour(false)}
          steps={tourSteps}
        />
      </ConfigProvider>
      <Navbar />
      <MyRoutes />
      <Footer />
    </div>
  );
}

export default App;
