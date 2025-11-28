import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ activeTab, THEME }) => {
  const navigate = useNavigate();

  const handleNavigation = (tab) => {
    if (tab === "profile") {
      navigate("/UserDashboard");
    } else {
      navigate(`/UserDashboard/${tab}`);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title" style={{ color: THEME }}>
        Student Dashboard
      </div>
      <button
        className={`sidebar-nav-item ${activeTab === "profile" ? "active" : ""}`}
        onClick={() => handleNavigation("profile")}
        style={{
          borderColor: activeTab === "profile" ? THEME : "#eee",
          backgroundColor: activeTab === "profile" ? THEME : "#f9fafb",
          color: activeTab === "profile" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-user"></i> Profile
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "announcements" ? "active" : ""}`}
        onClick={() => handleNavigation("announcements")}
        style={{
          borderColor: activeTab === "announcements" ? THEME : "#eee",
          backgroundColor: activeTab === "announcements" ? THEME : "#f9fafb",
          color: activeTab === "announcements" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-bullhorn"></i> Announcements
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "courses" ? "active" : ""}`}
        onClick={() => handleNavigation("courses")}
        style={{
          borderColor: activeTab === "courses" ? THEME : "#eee",
          backgroundColor: activeTab === "courses" ? THEME : "#f9fafb",
          color: activeTab === "courses" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-book"></i> Courses
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "assignments" ? "active" : ""}`}
        onClick={() => handleNavigation("assignments")}
        style={{
          borderColor: activeTab === "assignments" ? THEME : "#eee",
          backgroundColor: activeTab === "assignments" ? THEME : "#f9fafb",
          color: activeTab === "assignments" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-tasks"></i> Assignments
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "exams" ? "active" : ""}`}
        onClick={() => handleNavigation("exams")}
        style={{
          borderColor: activeTab === "exams" ? THEME : "#eee",
          backgroundColor: activeTab === "exams" ? THEME : "#f9fafb",
          color: activeTab === "exams" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-file-alt"></i> Exams
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "results" ? "active" : ""}`}
        onClick={() => handleNavigation("results")}
        style={{
          borderColor: activeTab === "results" ? THEME : "#eee",
          backgroundColor: activeTab === "results" ? THEME : "#f9fafb",
          color: activeTab === "results" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-chart-bar"></i> Results
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "lessonPlans" ? "active" : ""}`}
        onClick={() => handleNavigation("lessonPlans")}
        style={{
          borderColor: activeTab === "lessonPlans" ? THEME : "#eee",
          backgroundColor: activeTab === "lessonPlans" ? THEME : "#f9fafb",
          color: activeTab === "lessonPlans" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-book-open"></i> Lesson Plans
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "attendance" ? "active" : ""}`}
        onClick={() => handleNavigation("attendance")}
        style={{
          borderColor: activeTab === "attendance" ? THEME : "#eee",
          backgroundColor: activeTab === "attendance" ? THEME : "#f9fafb",
          color: activeTab === "attendance" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-calendar-check"></i> Attendance
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "quizzes" ? "active" : ""}`}
        onClick={() => handleNavigation("quizzes")}
        style={{
          borderColor: activeTab === "quizzes" ? THEME : "#eee",
          backgroundColor: activeTab === "quizzes" ? THEME : "#f9fafb",
          color: activeTab === "quizzes" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-question-circle"></i> Quizzes
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "update" ? "active" : ""}`}
        onClick={() => handleNavigation("update")}
        style={{
          borderColor: activeTab === "update" ? THEME : "#eee",
          backgroundColor: activeTab === "update" ? THEME : "#f9fafb",
          color: activeTab === "update" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-edit"></i> Update Profile
      </button>
      <button
        className={`sidebar-nav-item ${activeTab === "changePassword" ? "active" : ""}`}
        onClick={() => handleNavigation("changePassword")}
        style={{
          borderColor: activeTab === "changePassword" ? THEME : "#eee",
          backgroundColor: activeTab === "changePassword" ? THEME : "#f9fafb",
          color: activeTab === "changePassword" ? "#fff" : "#111"
        }}
      >
        <i className="fas fa-key"></i> Change Password
      </button>
    </aside>
  );
};

export default Sidebar;