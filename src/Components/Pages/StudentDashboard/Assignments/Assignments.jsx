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
      <div className="assignments-card">
        <div className="assignments-loading">
          <i className="fas fa-spinner fa-spin"></i> Loading assignments...
        </div>
      </div>
    );
  }

  return (
    <div className="assignments-card">
      <div className="assignments-header">
        <h2 className="assignments-title">
          <i className="fas fa-tasks"></i> My Assignments
        </h2>
      </div>

      <div className="assignments-filter-bar">
        <button
          className={`assignments-filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({assignments.length})
        </button>
        <button
          className={`assignments-filter-btn ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`assignments-filter-btn ${filter === "past" ? "active" : ""}`}
          onClick={() => setFilter("past")}
        >
          Past Due
        </button>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="assignments-empty">
          <i className="fas fa-folder-open" style={{ fontSize: 40, marginBottom: 10 }}></i>
          <p>No assignments found</p>
        </div>
      ) : (
        filteredAssignments.map((assignment) => (
          <div key={assignment._id} className="assignment-card">
            <div className="assignment-header">
              <div className="assignment-title">{assignment.title}</div>
              <span className={`assignment-badge ${assignment.status}`}>
                {assignment.status}
              </span>
            </div>

            <div className="assignment-meta">
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
              <div className="assignment-description">{assignment.description}</div>
            )}

            {assignment.questions && assignment.questions.length > 0 && (
              <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                <i className="fas fa-question-circle"></i> {assignment.questions.length} question(s)
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <Link
                to={`/UserDashboard/assignment/${assignment._id}`}
                className="assignment-submit-btn"
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
