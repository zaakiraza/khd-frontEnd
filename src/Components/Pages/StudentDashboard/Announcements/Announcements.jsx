import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Announcements.css";

const Announcements = ({ userDetails }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get("/message/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAnnouncements(response.data.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.showError("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diffTime / (1000 * 60));
        return minutes === 0 ? "Just now" : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  if (loading) {
    return (
      <div className="announcements-card">
        <div className="announcements-loading">
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 24, marginBottom: 10 }}></i>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="announcements-card">
        <div className="announcements-header">
          <h2 className="announcements-title">
            <i className="fas fa-bullhorn"></i> Announcements
          </h2>
        </div>

        {announcements.length === 0 ? (
          <div className="announcements-empty">
            <i className="fas fa-inbox" style={{ fontSize: 48, marginBottom: 16, color: "#d1d5db" }}></i>
            <p style={{ fontSize: 15, margin: 0 }}>No announcements yet</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="announcement-card"
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              <div className="announcement-card-header">
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 6 }}>
                    <span className={`type-badge ${announcement.type || 'email'}`}>
                      {announcement.type || 'email'}
                    </span>
                  </div>
                  <div className="announcement-subject">{announcement.subject || "No Subject"}</div>
                </div>
                <div className="announcement-date">
                  <i className="fas fa-clock"></i> {formatDate(announcement.sent_at || announcement.createdAt)}
                </div>
              </div>
              <div className="announcement-preview">{announcement.message}</div>
            </div>
          ))
        )}
      </div>

      {selectedAnnouncement && (
        <div className="announcement-modal" onClick={() => setSelectedAnnouncement(null)}>
          <div className="announcement-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="announcement-modal-header">
              <h2 className="announcement-modal-subject">
                {selectedAnnouncement.subject || "No Subject"}
              </h2>
              <button 
                className="announcement-close-btn"
                onClick={() => setSelectedAnnouncement(null)}
              >
                ×
              </button>
            </div>

            <div className="announcement-modal-meta">
              <span className={`type-badge ${selectedAnnouncement.type || 'email'}`}>
                {selectedAnnouncement.type || 'email'}
              </span>
              <span>
                <i className="fas fa-calendar-alt"></i>{" "}
                {new Date(selectedAnnouncement.sent_at || selectedAnnouncement.createdAt).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="announcement-modal-message">{selectedAnnouncement.message}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Announcements;
