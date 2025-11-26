import { Routes, Route } from "react-router-dom";
import NewAdmissions from "./Components/Pages/AdmissionForms/AdmissionForm";
import NotFound from "./Components/Common/NotFound/NotFound";
import LandingPage from "./Components/Pages/Landing/LandingPage/LandingPage";
import LoginStudent from "./Components/Pages/Login/LoginUser";
import Navbar from "./Components/Common/Navbar/Navbar";
import StudentDashboard from "./Components/Pages/StudentDashboard/StudentDashboard";
import SubmitAssignment from "./Components/Pages/StudentDashboard/SubmitAssignment/SubmitAssignment";
import TakeQuiz from "./Components/Pages/StudentDashboard/TakeQuiz/TakeQuiz";
import VerifyOtp from "./Components/Pages/VerifyOtp/VerifyOtp";
import PrivateRoute from "./Components/Routes/PrivateRoutes";
import { ToastProvider } from "./Components/Common/Toast/ToastContext";
import { useLocation } from "react-router-dom";
import { setupAxiosInterceptor } from "./utils/axiosInterceptor";
import { useEffect } from "react";
import "./index.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    setupAxiosInterceptor();
  }, []);
  const navbarVisibleRoutes = ["/", "/home"];
  const showNavbar = navbarVisibleRoutes.includes(location.pathname);
  return (
    <ToastProvider>
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
          <Route path="/UserDashboard" element={<StudentDashboard />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentDashboard />} />
            <Route path="announcements" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentDashboard />} />
            <Route path="assignments" element={<StudentDashboard />} />
            <Route path="exams" element={<StudentDashboard />} />
            <Route path="results" element={<StudentDashboard />} />
            <Route path="lessonPlans" element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentDashboard />} />
            <Route path="quizzes" element={<StudentDashboard />} />
            <Route path="update" element={<StudentDashboard />} />
          </Route>
          <Route path="/UserDashboard/assignment/:assignmentId" element={<SubmitAssignment />} />
          <Route path="/UserDashboard/quiz/:quizId" element={<TakeQuiz />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
