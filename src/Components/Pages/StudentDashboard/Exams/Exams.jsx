import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Exams.css";

const Exams = ({ userDetails }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  const styles = {
    card: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    h2: { fontSize: 18, margin: 0 },
    filterBar: {
      display: "flex",
      gap: 8,
      marginBottom: 12,
    },
    filterBtn: (active) => ({
      padding: "6px 12px",
      borderRadius: 6,
      border: active ? "1px solid #293c5d" : "1px solid #ddd",
      background: active ? "#293c5d" : "#f7f7f7",
      color: active ? "#fff" : "#333",
      cursor: "pointer",
      fontSize: 13,
    }),
    examCard: {
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      background: "#fafafa",
    },
    examHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      fontSize: 15,
      fontWeight: 600,
      color: "#111",
    },
    badge: (status) => {
      const colors = {
        scheduled: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
        ongoing: { bg: "#fef3c7", color: "#a16207", border: "#fde047" },
        completed: { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
        cancelled: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" },
      };
      const c = colors[status] || colors.scheduled;
      return {
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
      };
    },
    meta: {
      display: "flex",
      gap: 12,
      fontSize: 12,
      color: "#666",
      marginBottom: 8,
      flexWrap: "wrap",
    },
    loading: {
      textAlign: "center",
      padding: 20,
      color: "#666",
    },
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      
      // Try to get exams for user's class
      const classHistory = userDetails?.class_history || [];
      const currentClass = classHistory.find(ch => ch.status === "active");
      
      let url = "/exam-schedule";
      if (currentClass?.class_name?._id) {
        url = `/exam-schedule/class/${currentClass.class_name._id}`;
      }
      
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setExams(response.data.data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.showError("Failed to fetch exam schedules");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredExams = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case "upcoming":
        return exams.filter(e => {
          const examDate = new Date(e.exam_date);
          return examDate >= now && e.status === "scheduled";
        });
      case "completed":
        return exams.filter(e => e.status === "completed");
      case "all":
      default:
        return exams;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredExams = getFilteredExams();

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i> Loading exams...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.h2}>
          <i className="fas fa-graduation-cap"></i> Exam Schedule
        </h2>
      </div>

      <div style={styles.filterBar}>
        <button
          style={styles.filterBtn(filter === "upcoming")}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
        <button
          style={styles.filterBtn(filter === "completed")}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          style={styles.filterBtn(filter === "all")}
          onClick={() => setFilter("all")}
        >
          All ({exams.length})
        </button>
      </div>

      {filteredExams.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
          <i className="fas fa-calendar-times" style={{ fontSize: 40, marginBottom: 10 }}></i>
          <p>No exams found</p>
        </div>
      ) : (
        filteredExams.map((exam) => (
          <div key={exam._id} style={styles.examCard}>
            <div style={styles.examHeader}>
              <div style={styles.title}>{exam.exam_name}</div>
              <span style={styles.badge(exam.status)}>
                {exam.status}
              </span>
            </div>

            <div style={styles.meta}>
              <span>
                <i className="fas fa-book"></i> {exam.subject}
              </span>
              <span>
                <i className="fas fa-calendar"></i> {formatDate(exam.exam_date)}
              </span>
              <span>
                <i className="fas fa-clock"></i> {formatTime(exam.start_time)} - {formatTime(exam.end_time)}
              </span>
              <span>
                <i className="fas fa-hourglass-half"></i> {exam.duration} mins
              </span>
              <span>
                <i className="fas fa-star"></i> {exam.total_marks} marks (Pass: {exam.passing_marks})
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Exams;
