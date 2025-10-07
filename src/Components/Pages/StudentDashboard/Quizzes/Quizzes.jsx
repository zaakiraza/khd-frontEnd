import React from "react";
import "./Quizzes.css";

const Quizzes = ({ userDetails }) => {
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

  const calcQuizMarks = (item, idx) => {
    const base = item?.status === "completed" ? 85 : 70;
    const q1 = Math.min(100, base + (((idx + 1) * 3) % 10));
    const q2 = Math.min(100, base + (((idx + 2) * 5) % 12));
    const q3 = Math.min(100, base + (((idx + 3) * 4) % 8));
    return [q1, q2, q3];
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
        <h2 style={styles.h2}>Quiz Marks</h2>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>Course</th>
            <th style={styles.thtd}>Quiz 1</th>
            <th style={styles.thtd}>Quiz 2</th>
            <th style={styles.thtd}>Quiz 3</th>
            <th style={styles.thtd}>Average</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td style={styles.thtd} colSpan={5}>
                No data
              </td>
            </tr>
          ) : (
            classes.map((c, idx) => {
              const [q1, q2, q3] = calcQuizMarks(c, idx);
              const avg = Math.round((q1 + q2 + q3) / 3);
              return (
                <tr key={`quiz-${c?._id || idx}`}>
                  <td style={styles.thtd}>
                    {labelFrom(c?.class_name, "class_name")}
                  </td>
                  <td style={styles.thtd}>{q1}</td>
                  <td style={styles.thtd}>{q2}</td>
                  <td style={styles.thtd}>{q3}</td>
                  <td style={styles.thtd}>{avg}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div style={styles.small}>
        Note: Placeholder values until backend quizzes API is available.
      </div>
    </div>
  );
};

export default Quizzes;