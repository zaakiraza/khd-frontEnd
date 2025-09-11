import { Routes, Route } from "react-router-dom";
import NewAdmissions from "./Components/Pages/AdmissionForms/AdmissionForm";
import NotFound from "./Components/Common/NotFound";
import LandingPage from "./Components/Pages/LandingPage/LandingPage";
import LoginStudent from "./Components/Pages/Login/LoginUser";
import Navbar from "./Components/Common/Navbar/Navbar"
import "./index.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
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
