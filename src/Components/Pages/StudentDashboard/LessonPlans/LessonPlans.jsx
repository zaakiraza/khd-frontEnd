import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./LessonPlans.css";

const LessonPlans = ({ userDetails }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
    planCard: {
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      background: "#fafafa",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    planCardHover: {
      background: "#f3f4f6",
      borderColor: "#293c5d",
    },
    planHeader: {
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
    meta: {
      display: "flex",
      gap: 12,
      fontSize: 12,
      color: "#666",
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
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "#fff",
      borderRadius: 12,
      padding: 24,
      maxWidth: 600,
      maxHeight: "80vh",
      overflow: "auto",
      margin: 16,
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: "1px solid #e5e7eb",
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: 24,
      cursor: "pointer",
      color: "#666",
    },
  };

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      
      // Try to get lesson plans for user's class
      const classHistory = userDetails?.class_history || [];
      const currentClass = classHistory.find(ch => ch.status === "active");
      
      let url = "/lesson-plan?status=published";
      if (currentClass?.class_name?._id) {
        url = `/lesson-plan?class_id=${currentClass.class_name._id}&status=published`;
      }
      
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setLessonPlans(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lesson plans:", error);
      toast.showError("Failed to fetch lesson plans");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i> Loading lesson plans...
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.h2}>
            <i className="fas fa-book-open"></i> Lesson Plans
          </h2>
        </div>

        {lessonPlans.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
            <i className="fas fa-folder-open" style={{ fontSize: 40, marginBottom: 10 }}></i>
            <p>No lesson plans available</p>
          </div>
        ) : (
          lessonPlans.map((plan) => (
            <div
              key={plan._id}
              style={styles.planCard}
              onClick={() => setSelectedPlan(plan)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.borderColor = "#293c5d";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fafafa";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              <div style={styles.planHeader}>
                <div style={styles.title}>{plan.title}</div>
              </div>

              <div style={styles.meta}>
                <span>
                  <i className="fas fa-book"></i> {plan.subject}
                </span>
                <span>
                  <i className="fas fa-calendar-week"></i> Week {plan.week_number}, {plan.year}
                </span>
                <span>
                  <i className="fas fa-chalkboard"></i> {plan.class_name}
                </span>
              </div>

              {plan.description && (
                <div style={styles.description}>{plan.description}</div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedPlan && (
        <div style={styles.modal} onClick={() => setSelectedPlan(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: 18 }}>{selectedPlan.title}</h2>
              <button style={styles.closeBtn} onClick={() => setSelectedPlan(null)}>
                ×
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={styles.meta}>
                <span>
                  <i className="fas fa-book"></i> {selectedPlan.subject}
                </span>
                <span>
                  <i className="fas fa-calendar-week"></i> Week {selectedPlan.week_number}, {selectedPlan.year}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#555" }}>
                Description:
              </h3>
              <p style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>
                {selectedPlan.description}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#555" }}>
                Content:
              </h3>
              <div
                style={{
                  fontSize: 13,
                  color: "#333",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  background: "#f9fafb",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
                dangerouslySetInnerHTML={{ __html: selectedPlan.content }}
              />
            </div>

            {selectedPlan.attachments && selectedPlan.attachments.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#555" }}>
                  Attachments:
                </h3>
                {selectedPlan.attachments.map((att, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#293c5d", fontSize: 13 }}
                    >
                      <i className="fas fa-file"></i> {att.filename}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LessonPlans;
