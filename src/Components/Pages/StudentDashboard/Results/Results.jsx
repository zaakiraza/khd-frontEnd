import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Results.css";

const Results = ({ userDetails }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="results-card">
        <div className="results-loading">
          <i className="fas fa-spinner fa-spin"></i> Loading results...
        </div>
      </div>
    );
  }
  return (
    <div className="results-card">
      <div className="results-header">
        <h2 className="results-title">
          <i className="fas fa-chart-bar"></i> Exam Results
        </h2>
      </div>

      {results.length > 0 && (
        <div className="results-stat-card">
          <div className="results-stat-grid">
            <div className="results-stat-item">
              <div className="results-stat-value">{stats.totalExams}</div>
              <div className="results-stat-label">Total Exams</div>
            </div>
            <div className="results-stat-item">
              <div className="results-stat-value">{stats.avgMarks}</div>
              <div className="results-stat-label">Avg Marks</div>
            </div>
            <div className="results-stat-item">
              <div className="results-stat-value">{stats.avgPercentage}%</div>
              <div className="results-stat-label">Avg Percentage</div>
            </div>
            <div className="results-stat-item">
              <div className="results-stat-value">{stats.passedExams}</div>
              <div className="results-stat-label">Passed</div>
            </div>
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div className="results-empty">
          <i className="fas fa-file-alt"></i>
          <p>No results available yet</p>
        </div>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Subject</th>
              <th>Obtained</th>
              <th>Total</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              const percentage = ((result.obtained_marks / result.total_marks) * 100).toFixed(1);
              const grade = calculateGrade(result.obtained_marks, result.total_marks);
              const passed = result.obtained_marks >= (result.exam_id?.passing_marks || 0);
              
              return (
                <tr key={result._id}>
                  <td>{result?.exam_name}</td>
                  <td>{result?.subject}</td>
                  <td>{result.marks_obtained}</td>
                  <td>{result.total_marks}</td>
                  <td>{result.percentage}%</td>
                  <td>
                    <span className={`results-grade-badge results-badge-${grade.replace('+', '-plus')}`}>{grade}</span>
                  </td>
                  <td>
                    <span className={passed ? "results-status-pass" : "results-status-fail"}>
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
