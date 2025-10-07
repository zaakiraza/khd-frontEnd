import React from "react";
import "./Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab, THEME }) => {
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
        onClick={() => setActiveTab("profile")}
      >
        Profile
      </button>
      <button
        style={styles.navItem(activeTab === "courses")}
        onClick={() => setActiveTab("courses")}
      >
        Courses
      </button>
      <button
        style={styles.navItem(activeTab === "attendance")}
        onClick={() => setActiveTab("attendance")}
      >
        Attendance
      </button>
      <button
        style={styles.navItem(activeTab === "quizzes")}
        onClick={() => setActiveTab("quizzes")}
      >
        Quizzes
      </button>
      <button
        style={styles.navItem(activeTab === "update")}
        onClick={() => setActiveTab("update")}
      >
        Update Profile
      </button>
    </aside>
  );
};

export default Sidebar;