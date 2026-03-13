import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/secret-dashboard";

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <main className={isAdminPage ? "flex-1" : "flex-1 pt-28"}>
        {children}
      </main>

      {!isAdminPage && <Footer />}
      <ChatWidget />
    </div>
  );
};

export default Layout;
