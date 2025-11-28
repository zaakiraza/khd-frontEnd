import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Attendance.css";

const Attendance = ({ userDetails }) => {
  const toast = useToast();
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
      const response = await api.get("/leave/my-leaves", {
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
      await api.post("/leave", leaveForm, {
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
      await api.delete(`/leave/${leaveId}`, {
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
      <div className="attendance-card">
        <div className="attendance-header">
          <h2 className="attendance-title">Attendance & Leave</h2>
        </div>

        <div className="attendance-tabs">
          <button
            className={`attendance-tab ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            <i className="fas fa-calendar-check"></i> Attendance
          </button>
          <button
            className={`attendance-tab ${activeTab === "leaves" ? "active" : ""}`}
            onClick={() => setActiveTab("leaves")}
          >
            <i className="fas fa-file-medical"></i> Leave Requests
          </button>
        </div>

        {activeTab === "attendance" && (
          <>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th className="attendance-th">Course</th>
                  <th className="attendance-th">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {classes.length === 0 ? (
                  <tr>
                    <td className="attendance-td" colSpan={2}>
                      No data
                    </td>
                  </tr>
                ) : (
                  classes.map((c, idx) => (
                    <tr key={`att-${c?._id || idx}`}>
                      <td className="attendance-td">
                        {labelFrom(c?.class_name, "class_name")}
                      </td>
                      <td className="attendance-td">{calcAttendance(c, idx)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="attendance-note">
              Note: Placeholder values until backend attendance API is available.
            </div>
          </>
        )}

        {activeTab === "leaves" && (
          <>
            <div className="attendance-leave-actions">
              <button
                className="attendance-btn"
                onClick={() => setShowLeaveForm(true)}
              >
                <i className="fas fa-plus"></i> Apply for Leave
              </button>
            </div>

            {loadingLeaves ? (
              <div className="attendance-loading">
                <i className="fas fa-spinner fa-spin"></i> Loading...
              </div>
            ) : leaves.length === 0 ? (
              <div className="attendance-empty">
                <i className="fas fa-inbox"></i>
                <p>No leave requests yet</p>
              </div>
            ) : (
              leaves.map((leave) => (
                <div key={leave._id} className="attendance-leave-card">
                  <div className="attendance-leave-header">
                    <div className="attendance-leave-info">
                      <div className="attendance-leave-type">
                        {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)} Leave
                      </div>
                      <div className="attendance-leave-dates">
                        {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                      </div>
                    </div>
                    <span className={`attendance-status-badge ${leave.status}`}>{leave.status}</span>
                  </div>
                  <div className="attendance-leave-reason">
                    <strong>Reason:</strong> {leave.reason}
                  </div>
                  {leave.admin_comments && (
                    <div className="attendance-admin-comments">
                      <strong>Admin Comments:</strong> {leave.admin_comments}
                    </div>
                  )}
                  {leave.status === "pending" && (
                    <button
                      className="attendance-btn attendance-btn-secondary attendance-btn-small"
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
        <div className="attendance-modal" onClick={() => setShowLeaveForm(false)}>
          <div className="attendance-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="attendance-modal-header">
              <h2>Apply for Leave</h2>
              <button className="attendance-close-btn" onClick={() => setShowLeaveForm(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit}>
              <div className="attendance-form-group">
                <label className="attendance-label">Leave Type *</label>
                <select
                  className="attendance-input"
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

              <div className="attendance-form-group">
                <label className="attendance-label">Start Date *</label>
                <input
                  type="date"
                  className="attendance-input"
                  value={leaveForm.start_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                  required
                />
              </div>

              <div className="attendance-form-group">
                <label className="attendance-label">End Date *</label>
                <input
                  type="date"
                  className="attendance-input"
                  value={leaveForm.end_date}
                  onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                  required
                />
              </div>

              <div className="attendance-form-group">
                <label className="attendance-label">Reason *</label>
                <textarea
                  className="attendance-textarea"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Please provide a reason for your leave..."
                  required
                />
              </div>

              <div className="attendance-form-actions">
                <button
                  type="button"
                  className="attendance-btn attendance-btn-secondary"
                  onClick={() => setShowLeaveForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="attendance-btn" disabled={submitting}>
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
