import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Announcements.css";

const Announcements = ({ userDetails }) => {
  const toast = useToast();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const token = localStorage.getItem("token");
  
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

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
      paddingBottom: 12,
      borderBottom: "2px solid #f3f4f6",
    },
    h2: { 
      fontSize: 20, 
      margin: 0,
      color: "#293c5d",
      fontWeight: 700,
    },
    announcementCard: {
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 14,
      marginBottom: 12,
      background: "#fafafa",
      cursor: "pointer",
      transition: "all 0.2s",
      borderLeft: "4px solid #293c5d",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    subject: {
      fontSize: 16,
      fontWeight: 600,
      color: "#111",
      marginBottom: 4,
    },
    date: {
      fontSize: 12,
      color: "#666",
      whiteSpace: "nowrap",
    },
    preview: {
      fontSize: 14,
      color: "#555",
      lineHeight: 1.5,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    typeBadge: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      textTransform: "uppercase",
      marginRight: 8,
    },
    emailBadge: {
      background: "#dbeafe",
      color: "#1e40af",
    },
    smsBadge: {
      background: "#dcfce7",
      color: "#166534",
    },
    loading: {
      textAlign: "center",
      padding: 20,
      color: "#666",
    },
    empty: {
      textAlign: "center",
      padding: 40,
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
      maxWidth: 700,
      maxHeight: "80vh",
      overflow: "auto",
      margin: 16,
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: "1px solid #e5e7eb",
    },
    modalSubject: {
      fontSize: 20,
      fontWeight: 700,
      color: "#111",
      margin: 0,
      flex: 1,
      marginRight: 16,
    },
    closeBtn: {
      background: "none",
      border: "none",
      fontSize: 28,
      cursor: "pointer",
      color: "#666",
      lineHeight: 1,
      padding: 0,
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
      transition: "all 0.2s",
    },
    modalMeta: {
      display: "flex",
      gap: 12,
      marginBottom: 20,
      fontSize: 13,
      color: "#666",
    },
    modalMessage: {
      fontSize: 15,
      color: "#333",
      lineHeight: 1.7,
      whiteSpace: "pre-wrap",
      background: "#f9fafb",
      padding: 16,
      borderRadius: 8,
      border: "1px solid #e5e7eb",
    },
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}/message/announcements`, {
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
      <div style={styles.card}>
        <div style={styles.loading}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 24, marginBottom: 10 }}></i>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.h2}>
            <i className="fas fa-bullhorn"></i> Announcements
          </h2>
        </div>

        {announcements.length === 0 ? (
          <div style={styles.empty}>
            <i className="fas fa-inbox" style={{ fontSize: 48, marginBottom: 16, color: "#d1d5db" }}></i>
            <p style={{ fontSize: 15, margin: 0 }}>No announcements yet</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              style={styles.announcementCard}
              onClick={() => setSelectedAnnouncement(announcement)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.borderLeftColor = "#1e40af";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fafafa";
                e.currentTarget.style.borderLeftColor = "#293c5d";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={styles.cardHeader}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 6 }}>
                    <span 
                      style={{
                        ...styles.typeBadge,
                        ...(announcement.type === "email" ? styles.emailBadge : styles.smsBadge)
                      }}
                    >
                      {announcement.type}
                    </span>
                  </div>
                  <div style={styles.subject}>{announcement.subject || "No Subject"}</div>
                </div>
                <div style={styles.date}>
                  <i className="fas fa-clock"></i> {formatDate(announcement.sent_at || announcement.createdAt)}
                </div>
              </div>
              <div style={styles.preview}>{announcement.message}</div>
            </div>
          ))
        )}
      </div>

      {selectedAnnouncement && (
        <div style={styles.modal} onClick={() => setSelectedAnnouncement(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalSubject}>
                {selectedAnnouncement.subject || "No Subject"}
              </h2>
              <button 
                style={styles.closeBtn} 
                onClick={() => setSelectedAnnouncement(null)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                  e.currentTarget.style.color = "#111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#666";
                }}
              >
                ×
              </button>
            </div>

            <div style={styles.modalMeta}>
              <span 
                style={{
                  ...styles.typeBadge,
                  ...(selectedAnnouncement.type === "email" ? styles.emailBadge : styles.smsBadge)
                }}
              >
                {selectedAnnouncement.type}
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

            <div style={styles.modalMessage}>{selectedAnnouncement.message}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Announcements;
