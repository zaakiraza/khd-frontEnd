import React from "react";
import "./Attendance.css";

const Attendance = ({ userDetails }) => {
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

  return (
    <div style={{ ...styles.card }}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Attendance</h2>
      </div>
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
    </div>
  );
};

export default Attendance;
