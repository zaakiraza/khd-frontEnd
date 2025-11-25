import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Attendance.css";

const Attendance = ({ userDetails }) => {
  const toast = useToast();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("attendance");
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leave_type: "sick",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const styles = {
    card: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    h2: { fontSize: 18, margin: 0 },
    table: { width: "100%", borderCollapse: "collapse" },
    thtd: {
      borderBottom: "1px solid #eee",
      padding: "8px 6px",
      textAlign: "left",
      fontSize: 13,
    },
    small: { fontSize: 12, color: "#666" },
    tabs: {
      display: "flex",
      gap: 8,
      marginBottom: 16,
      borderBottom: "2px solid #f3f4f6",
    },
    tab: (active) => ({
      padding: "8px 16px",
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: active ? 600 : 400,
      color: active ? "#293c5d" : "#666",
      borderBottom: active ? "2px solid #293c5d" : "2px solid transparent",
      marginBottom: -2,
      transition: "all 0.2s",
    }),
    btn: {
      padding: "8px 16px",
      borderRadius: 6,
      border: "1px solid #293c5d",
      background: "#293c5d",
      color: "#fff",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
      transition: "all 0.2s",
    },
    btnSecondary: {
      background: "#fff",
      color: "#293c5d",
      border: "1px solid #ddd",
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 6,
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: 6,
      fontSize: 14,
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: 6,
      fontSize: 14,
      minHeight: 80,
      resize: "vertical",
      boxSizing: "border-box",
    },
    leaveCard: {
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      background: "#fafafa",
    },
    statusBadge: (status) => ({
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase",
      background:
        status === "approved"
          ? "#dcfce7"
          : status === "rejected"
          ? "#fee2e2"
          : "#fef3c7",
      color:
        status === "approved"
          ? "#166534"
          : status === "rejected"
          ? "#991b1b"
          : "#92400e",
    }),
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
      maxWidth: 500,
      width: "90%",
      maxHeight: "80vh",
      overflow: "auto",
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
    formActions: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end",
      marginTop: 16,
    },
  };

  const classes = userDetails?.class_history || [];

  const calcAttendance = (item, idx) => {
    const base = item?.status === "completed" ? 88 : 72;
    const bump = ((idx + 1) * 7) % 9; // small variation
    return Math.min(100, base + bump);
  };

  const labelFrom = (entity, key) => {
    if (!entity) return "-";
    if (typeof entity === "string") return `${entity.slice(0, 6)}…`;
    if (entity && typeof entity === "object") {
      return entity[key] || entity.name || JSON.stringify(entity).slice(0, 12);
    }
    return "-";
  };

  useEffect(() => {
    if (activeTab === "leaves") {
      fetchLeaves();
    }
  }, [activeTab]);

  const fetchLeaves = async () => {
    try {
      setLoadingLeaves(true);
      const response = await axios.get(`${BASEURL}/leave/my-leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(response.data.data || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.showError("Failed to fetch leave requests");
    } finally {
      setLoadingLeaves(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    
    if (!leaveForm.start_date || !leaveForm.end_date || !leaveForm.reason.trim()) {
      toast.showError("Please fill all required fields");
      return;
    }

    if (new Date(leaveForm.end_date) < new Date(leaveForm.start_date)) {
      toast.showError("End date must be after start date");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${BASEURL}/leave`, leaveForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.showSuccess("Leave request submitted successfully");
      setShowLeaveForm(false);
      setLeaveForm({
        leave_type: "sick",
        start_date: "",
        end_date: "",
        reason: "",
      });
      fetchLeaves();
    } catch (error) {
      console.error("Error submitting leave:", error);
      toast.showError(error.response?.data?.message || "Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) {
      return;
    }

    try {
      await axios.delete(`${BASEURL}/leave/${leaveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.showSuccess("Leave request deleted successfully");
      fetchLeaves();
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.showError("Failed to delete leave request");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div style={{ ...styles.card }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.h2}>Attendance & Leave</h2>
        </div>

        <div style={styles.tabs}>
          <button
            style={styles.tab(activeTab === "attendance")}
            onClick={() => setActiveTab("attendance")}
          >
            <i className="fas fa-calendar-check"></i> Attendance
          </button>
          <button
            style={styles.tab(activeTab === "leaves")}
            onClick={() => setActiveTab("leaves")}
          >
            <i className="fas fa-file-medical"></i> Leave Requests
          </button>
        </div>

        {activeTab === "attendance" && (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.thtd}>Course</th>
                  <th style={styles.thtd}>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {classes.length === 0 ? (
                  <tr>
                    <td style={styles.thtd} colSpan={2}>
                      No data
                    </td>
                  </tr>
                ) : (
                  classes.map((c, idx) => (
                    <tr key={`att-${c?._id || idx}`}>
                      <td style={styles.thtd}>
                        {labelFrom(c?.class_name, "class_name")}
                      </td>
                      <td style={styles.thtd}>{calcAttendance(c, idx)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div style={styles.small}>
              Note: Placeholder values until backend attendance API is available.
            </div>
          </>
        )}

        {activeTab === "leaves" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <button
                style={styles.btn}
                onClick={() => setShowLeaveForm(true)}
              >
                <i className="fas fa-plus"></i> Apply for Leave
              </button>
            </div>

            {loadingLeaves ? (
              <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
                <i className="fas fa-spinner fa-spin"></i> Loading...
              </div>
            ) : leaves.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
                <i className="fas fa-inbox" style={{ fontSize: 40, marginBottom: 10 }}></i>
                <p>No leave requests yet</p>
              </div>
            ) : (
              leaves.map((leave) => (
                <div key={leave._id} style={styles.leaveCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                        {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)} Leave
                      </div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                      </div>
                    </div>
                    <span style={styles.statusBadge(leave.status)}>{leave.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
                    <strong>Reason:</strong> {leave.reason}
                  </div>
                  {leave.admin_comments && (
                    <div style={{ fontSize: 12, color: "#666", background: "#f9fafb", padding: 8, borderRadius: 4, marginBottom: 8 }}>
                      <strong>Admin Comments:</strong> {leave.admin_comments}
                    </div>
                  )}
                  {leave.status === "pending" && (
                    <button
                      style={{ ...styles.btn, ...styles.btnSecondary, fontSize: 12, padding: "4px 12px" }}
                      onClick={() => handleDeleteLeave(leave._id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {showLeaveForm && (
        <div style={styles.modal} onClick={() => setShowLeaveForm(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Apply for Leave</h2>
              <button style={styles.closeBtn} onClick={() => setShowLeaveForm(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Leave Type *</label>
                <select
                  style={styles.input}
                  value={leaveForm.leave_type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                  required
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Start Date *</label>
                <input
                  type="date"
                  style={styles.input}
                  value={leaveForm.start_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>End Date *</label>
                <input
                  type="date"
                  style={styles.input}
                  value={leaveForm.end_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Reason *</label>
                <textarea
                  style={styles.textarea}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Please provide a reason for your leave..."
                  required
                />
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  style={{ ...styles.btn, ...styles.btnSecondary }}
                  onClick={() => setShowLeaveForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.btn} disabled={submitting}>
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Attendance;
