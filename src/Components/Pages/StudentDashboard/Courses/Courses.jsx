import React from "react";
import "./Courses.css";

const Courses = ({ userDetails }) => {
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
    tag: {
      padding: "2px 8px",
      background: "#f1f5f9",
      borderRadius: 999,
      fontSize: 12,
      border: "1px solid #e2e8f0",
    },
  };

  const classes = userDetails?.class_history || [];

  const labelFrom = (entity, key) => {
    if (!entity) return "-";
    if (typeof entity === "string") return `${entity.slice(0, 6)}…`;
    if (entity && typeof entity === "object") {
      return entity[key] || entity.name || JSON.stringify(entity).slice(0, 12);
    }
    return "-";
  };

  return (
    <div style={{ ...styles.card }}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Registered Courses</h2>
        <span style={styles.small}>{classes.length} total</span>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>#</th>
            <th style={styles.thtd}>Class</th>
            <th style={styles.thtd}>Year</th>
            <th style={styles.thtd}>Session</th>
            <th style={styles.thtd}>Status</th>
            <th style={styles.thtd}>Result</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td style={styles.thtd} colSpan={6}>
                No registered classes yet.
              </td>
            </tr>
          ) : (
            classes.map((c, idx) => (
              <tr key={`${c?._id || idx}`}>
                <td style={styles.thtd}>{idx + 1}</td>
                <td style={styles.thtd}>
                  {labelFrom(c?.class_name, "class_name")}
                </td>
                <td style={styles.thtd}>{c?.year || "-"}</td>
                <td style={styles.thtd}>
                  {labelFrom(c?.session, "session_name")}
                </td>
                <td style={styles.thtd}>
                  <span style={styles.tag}>{c?.status || "-"}</span>
                </td>
                <td style={styles.thtd}>{c?.result || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;