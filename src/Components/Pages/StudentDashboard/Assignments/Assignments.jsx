import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Assignments.css";

const Assignments = ({ userDetails }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
    assignmentCard: {
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      background: "#fafafa",
    },
    assignmentHeader: {
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
    badge: (status) => ({
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      background: status === "published" ? "#dcfce7" : "#fef3c7",
      color: status === "published" ? "#15803d" : "#a16207",
      border: `1px solid ${status === "published" ? "#86efac" : "#fde047"}`,
    }),
    meta: {
      display: "flex",
      gap: 12,
      fontSize: 12,
      color: "#666",
      marginBottom: 8,
    },
    description: {
      fontSize: 13,
      color: "#555",
      marginTop: 8,
    },
    loading: {
      textAlign: "center",
      padding: 20,
      color: "#666",
    },
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const classId = userDetails?.personal_info?.enrolled_class;
      
      let url = "/assignment";
      if (classId && classId !== "null") {
        // If user has a class, fetch assignments for that class
        const classHistory = userDetails?.class_history || [];
        const currentClass = classHistory.find(ch => ch.status === "active");
        if (currentClass?.class_name?._id) {
          url = `/assignment/class/${currentClass.class_name._id}`;
        }
      }
      
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAssignments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.showError("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAssignments = () => {
    const now = new Date();
    
    switch (filter) {
      case "active":
        return assignments.filter(a => new Date(a.due_date) >= now && a.status === "published");
      case "past":
        return assignments.filter(a => new Date(a.due_date) < now);
      case "all":
      default:
        return assignments;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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

  const filteredAssignments = getFilteredAssignments();

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i> Loading assignments...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.h2}>
          <i className="fas fa-tasks"></i> My Assignments
        </h2>
      </div>

      <div style={styles.filterBar}>
        <button
          style={styles.filterBtn(filter === "all")}
          onClick={() => setFilter("all")}
        >
          All ({assignments.length})
        </button>
        <button
          style={styles.filterBtn(filter === "active")}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          style={styles.filterBtn(filter === "past")}
          onClick={() => setFilter("past")}
        >
          Past Due
        </button>
      </div>

      {filteredAssignments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
          <i className="fas fa-folder-open" style={{ fontSize: 40, marginBottom: 10 }}></i>
          <p>No assignments found</p>
        </div>
      ) : (
        filteredAssignments.map((assignment) => (
          <div key={assignment._id} style={styles.assignmentCard}>
            <div style={styles.assignmentHeader}>
              <div style={styles.title}>{assignment.title}</div>
              <span style={styles.badge(assignment.status)}>
                {assignment.status}
              </span>
            </div>

            <div style={styles.meta}>
              <span>
                <i className="fas fa-book"></i> {assignment.subject}
              </span>
              <span>
                <i className="fas fa-calendar"></i> Due: {formatDate(assignment.due_date)}
              </span>
              {assignment.end_time && (
                <span>
                  <i className="fas fa-clock"></i> {formatTime(assignment.end_time)}
                </span>
              )}
              <span>
                <i className="fas fa-star"></i> {assignment.total_marks} marks
              </span>
            </div>

            {assignment.description && (
              <div style={styles.description}>{assignment.description}</div>
            )}

            {assignment.questions && assignment.questions.length > 0 && (
              <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                <i className="fas fa-question-circle"></i> {assignment.questions.length} question(s)
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <Link
                to={`/UserDashboard/assignment/${assignment._id}`}
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  background: "#293c5d",
                  color: "#fff",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1e2d47";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#293c5d";
                }}
              >
                <i className="fas fa-edit"></i> View & Submit
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Assignments;
