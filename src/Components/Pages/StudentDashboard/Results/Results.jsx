import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Results.css";

const Results = ({ userDetails }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

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
    table: { width: "100%", borderCollapse: "collapse", marginTop: 12 },
    thtd: {
      borderBottom: "1px solid #eee",
      padding: "10px 8px",
      textAlign: "left",
      fontSize: 13,
    },
    th: {
      fontWeight: 600,
      color: "#555",
    },
    badge: (grade) => {
      const colors = {
        A: { bg: "#dcfce7", color: "#15803d" },
        B: { bg: "#dbeafe", color: "#1e40af" },
        C: { bg: "#fef3c7", color: "#a16207" },
        D: { bg: "#fee2e2", color: "#b91c1c" },
        F: { bg: "#f3f4f6", color: "#374151" },
      };
      const c = colors[grade] || colors.F;
      return {
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: c.bg,
        color: c.color,
        display: "inline-block",
      };
    },
    loading: {
      textAlign: "center",
      padding: 20,
      color: "#666",
    },
    statCard: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    statGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: 12,
    },
    statItem: {
      textAlign: "center",
    },
    statValue: {
      fontSize: 20,
      fontWeight: 700,
      color: "#293c5d",
    },
    statLabel: {
      fontSize: 11,
      color: "#666",
      marginTop: 4,
    },
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const userId = userDetails?._id;
      
      if (!userId) {
        toast.showError("User ID not found");
        return;
      }
      
      const response = await api.get(`/result/student/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setResults(response.data.data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
      if (error.response?.status !== 404) {
        toast.showError("Failed to fetch results");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (obtained, total) => {
    const percentage = (obtained / total) * 100;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const calculateStats = () => {
    if (results.length === 0) return { totalExams: 0, avgMarks: 0, avgPercentage: 0, passedExams: 0 };
    
    const totalExams = results.length;
    const totalObtained = results.reduce((sum, r) => sum + (r.obtained_marks || 0), 0);
    const totalMarks = results.reduce((sum, r) => sum + (r.total_marks || 0), 0);
    const avgMarks = totalExams > 0 ? (totalObtained / totalExams).toFixed(1) : 0;
    const avgPercentage = totalMarks > 0 ? ((totalObtained / totalMarks) * 100).toFixed(1) : 0;
    const passedExams = results.filter(r => 
      r.obtained_marks >= (r.exam_id?.passing_marks || 0)
    ).length;
    
    return { totalExams, avgMarks, avgPercentage, passedExams };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i> Loading results...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.h2}>
          <i className="fas fa-chart-bar"></i> Exam Results
        </h2>
      </div>

      {results.length > 0 && (
        <div style={styles.statCard}>
          <div style={styles.statGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.totalExams}</div>
              <div style={styles.statLabel}>Total Exams</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.avgMarks}</div>
              <div style={styles.statLabel}>Avg Marks</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.avgPercentage}%</div>
              <div style={styles.statLabel}>Avg Percentage</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.passedExams}</div>
              <div style={styles.statLabel}>Passed</div>
            </div>
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
          <i className="fas fa-file-alt" style={{ fontSize: 40, marginBottom: 10 }}></i>
          <p>No results available yet</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.thtd, ...styles.th }}>Exam</th>
              <th style={{ ...styles.thtd, ...styles.th }}>Subject</th>
              <th style={{ ...styles.thtd, ...styles.th }}>Obtained</th>
              <th style={{ ...styles.thtd, ...styles.th }}>Total</th>
              <th style={{ ...styles.thtd, ...styles.th }}>Percentage</th>
              <th style={{ ...styles.thtd, ...styles.th }}>Grade</th>
              <th style={{ ...styles.thtd, ...styles.th }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              const percentage = ((result.obtained_marks / result.total_marks) * 100).toFixed(1);
              const grade = calculateGrade(result.obtained_marks, result.total_marks);
              const passed = result.obtained_marks >= (result.exam_id?.passing_marks || 0);
              
              return (
                <tr key={result._id}>
                  <td style={styles.thtd}>{result.exam_id?.exam_name || "N/A"}</td>
                  <td style={styles.thtd}>{result.exam_id?.subject || "N/A"}</td>
                  <td style={styles.thtd}>{result.obtained_marks}</td>
                  <td style={styles.thtd}>{result.total_marks}</td>
                  <td style={styles.thtd}>{percentage}%</td>
                  <td style={styles.thtd}>
                    <span style={styles.badge(grade)}>{grade}</span>
                  </td>
                  <td style={styles.thtd}>
                    <span style={{
                      color: passed ? "#15803d" : "#b91c1c",
                      fontWeight: 600,
                      fontSize: 12,
                    }}>
                      {passed ? "✓ Pass" : "✗ Fail"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Results;
