import { Routes, Route } from "react-router-dom";
import NewAdmissions from "./Components/Pages/AdmissionForms/AdmissionForm";
import NotFound from "./Components/Common/NotFound/NotFound";
import LandingPage from "./Components/Pages/LandingPage/LandingPage";
import LoginStudent from "./Components/Pages/Login/LoginUser";
import Navbar from "./Components/Common/Navbar/Navbar";
import { useLocation } from "react-router-dom";
import "./index.css";

function App() {
  const location = useLocation();
  const navbarVisibleRoutes = ["/", "/home"];
  const showNavbar = navbarVisibleRoutes.includes(location.pathname);
  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="home" element={<LandingPage />} />
        <Route path="/new-admission/form" element={<NewAdmissions />} />

        {/* LOGIN STUDENT */}
        <Route path="/login-student" element={<LoginStudent />} />

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
