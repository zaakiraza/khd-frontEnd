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

  const styles = {
    sidebar: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 12,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    navItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      padding: "10px 12px",
      marginBottom: 6,
      borderRadius: 8,
      border: `1px solid ${active ? THEME : "#eee"}`,
      background: active ? THEME : "#f9fafb",
      color: active ? "#fff" : "#111",
      cursor: "pointer",
    }),
  };

  return (
    <aside style={styles.sidebar}>
      <div style={{ fontWeight: 700, margin: "2px 4px 8px", color: THEME }}>
        Student Dashboard
      </div>
      <button
        style={styles.navItem(activeTab === "profile")}
        onClick={() => handleNavigation("profile")}
      >
        <i className="fas fa-user"></i> Profile
      </button>
      <button
        style={styles.navItem(activeTab === "announcements")}
        onClick={() => handleNavigation("announcements")}
      >
        <i className="fas fa-bullhorn"></i> Announcements
      </button>
      <button
        style={styles.navItem(activeTab === "courses")}
        onClick={() => handleNavigation("courses")}
      >
        <i className="fas fa-book"></i> Courses
      </button>
      <button
        style={styles.navItem(activeTab === "assignments")}
        onClick={() => handleNavigation("assignments")}
      >
        <i className="fas fa-tasks"></i> Assignments
      </button>
      <button
        style={styles.navItem(activeTab === "exams")}
        onClick={() => handleNavigation("exams")}
      >
        <i className="fas fa-file-alt"></i> Exams
      </button>
      <button
        style={styles.navItem(activeTab === "results")}
        onClick={() => handleNavigation("results")}
      >
        <i className="fas fa-chart-bar"></i> Results
      </button>
      <button
        style={styles.navItem(activeTab === "lessonPlans")}
        onClick={() => handleNavigation("lessonPlans")}
      >
        <i className="fas fa-book-open"></i> Lesson Plans
      </button>
      <button
        style={styles.navItem(activeTab === "attendance")}
        onClick={() => handleNavigation("attendance")}
      >
        <i className="fas fa-calendar-check"></i> Attendance
      </button>
      <button
        style={styles.navItem(activeTab === "quizzes")}
        onClick={() => handleNavigation("quizzes")}
      >
        <i className="fas fa-question-circle"></i> Quizzes
      </button>
      <button
        style={styles.navItem(activeTab === "update")}
        onClick={() => handleNavigation("update")}
      >
        <i className="fas fa-edit"></i> Update Profile
      </button>
    </aside>
  );
};

export default Sidebar;