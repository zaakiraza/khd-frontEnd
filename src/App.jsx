import { Routes, Route } from "react-router-dom";
import NewAdmissions from "./Components/Pages/AdmissionForms/AdmissionForm";
import NotFound from "./Components/Common/NotFound/NotFound";
import LandingPage from "./Components/Pages/Landing/LandingPage/LandingPage";
import LoginStudent from "./Components/Pages/Login/LoginUser";
import Navbar from "./Components/Common/Navbar/Navbar";
import StudentDashboard from "./Components/Pages/StudentDashboard/StudentDashboard";
import VerifyOtp from "./Components/Pages/VerifyOtp/VerifyOtp";
import PrivateRoute from "./Components/Routes/PrivateRoutes";
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

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/UserDashboard" element={<StudentDashboard />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
