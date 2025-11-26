import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./SubmitAssignment.css";

const SubmitAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem("token");

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [existingSubmission, setExistingSubmission] = useState(null);

  const styles = {
    container: {
      maxWidth: 900,
      margin: "0 auto",
      padding: 20,
    },
    card: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 20,
      marginBottom: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    header: {
      marginBottom: 20,
      paddingBottom: 16,
      borderBottom: "2px solid #f3f4f6",
    },
    title: {
      fontSize: 24,
      fontWeight: 700,
      color: "#293c5d",
      marginBottom: 8,
    },
    meta: {
      display: "flex",
      gap: 16,
      fontSize: 14,
      color: "#666",
      flexWrap: "wrap",
    },
    description: {
      fontSize: 15,
      color: "#555",
      lineHeight: 1.6,
      marginBottom: 20,
      padding: 12,
      background: "#f9fafb",
      borderRadius: 6,
    },
    questionCard: {
      background: "#fafafa",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    questionHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    questionText: {
      fontSize: 15,
      fontWeight: 600,
      color: "#111",
      marginBottom: 12,
    },
    marks: {
      fontSize: 13,
      color: "#293c5d",
      fontWeight: 600,
    },
    option: {
      display: "flex",
      alignItems: "center",
      padding: "10px 12px",
      margin: "8px 0",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: 6,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    optionSelected: {
      background: "#e0e7ff",
      borderColor: "#293c5d",
    },
    radio: {
      marginRight: 10,
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #ddd",
      borderRadius: 6,
      fontSize: 14,
      minHeight: 100,
      resize: "vertical",
      boxSizing: "border-box",
    },
    btnContainer: {
      display: "flex",
      gap: 12,
      justifyContent: "flex-end",
      marginTop: 20,
    },
    btn: {
      padding: "10px 20px",
      borderRadius: 6,
      border: "none",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    btnPrimary: {
      background: "#293c5d",
      color: "#fff",
    },
    btnSecondary: {
      background: "#fff",
      color: "#293c5d",
      border: "1px solid #ddd",
    },
    loading: {
      textAlign: "center",
      padding: 40,
      color: "#666",
    },
    submittedBanner: {
      background: "#dcfce7",
      color: "#166534",
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
      border: "1px solid #86efac",
    },
  };

  useEffect(() => {
    fetchAssignment();
    checkExistingSubmission();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignment(response.data.data);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      toast.showError("Failed to fetch assignment details");
    } finally {
      setLoading(false);
    }
  };

  const checkExistingSubmission = async () => {
    try {
      const response = await api.get(
        `/assignment-submission/assignment/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingSubmission(response.data.data);
    } catch (error) {
      // No submission found, which is fine
      console.log("No existing submission");
    }
  };

  const handleAnswerChange = (questionId, value, selectedOption = null) => {
    setAnswers({
      ...answers,
      [questionId]: {
        question_id: questionId,
        answer: value,
        selected_option: selectedOption,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all questions are answered
    const unansweredQuestions = assignment.questions.filter(
      (q) => !answers[q._id]
    );
    if (unansweredQuestions.length > 0) {
      toast.showError(
        `Please answer all questions (${unansweredQuestions.length} remaining)`
      );
      return;
    }

    if (!window.confirm("Are you sure you want to submit this assignment?")) {
      return;
    }

    try {
      setSubmitting(true);
      await api.post(
        "/assignment-submission",
        {
          assignment_id: assignmentId,
          answers: Object.values(answers),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.showSuccess("Assignment submitted successfully!");
      navigate("/UserDashboard");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.showError(
        error.response?.data?.message || "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loading}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: 32 }}></i>
            <p>Loading assignment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>Assignment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {existingSubmission && (
        <div style={styles.submittedBanner}>
          <strong>✓ Already Submitted</strong>
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>
            You submitted this assignment on{" "}
            {new Date(existingSubmission.submitted_at).toLocaleString()}
            {existingSubmission.status === "graded" && (
              <>
                <br />
                Score: {existingSubmission.total_marks_obtained} /{" "}
                {assignment.total_marks}
              </>
            )}
          </p>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>{assignment.title}</h1>
          <div style={styles.meta}>
            <span>
              <i className="fas fa-book"></i> {assignment.subject}
            </span>
            <span>
              <i className="fas fa-chalkboard"></i> {assignment.class_name}
            </span>
            <span>
              <i className="fas fa-calendar"></i> Due:{" "}
              {formatDate(assignment.due_date)}
            </span>
            <span>
              <i className="fas fa-clock"></i> {formatTime(assignment.end_time)}
            </span>
            <span>
              <i className="fas fa-star"></i> Total Marks:{" "}
              {assignment.total_marks}
            </span>
          </div>
        </div>

        {assignment.description && (
          <div style={styles.description}>
            <strong>Description:</strong>
            <p style={{ margin: "8px 0 0" }}>{assignment.description}</p>
          </div>
        )}
      </div>

      {!existingSubmission && (
        <form onSubmit={handleSubmit}>
          {assignment.questions.map((question, index) => (
            <div key={question._id} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <span style={{ fontSize: 13, color: "#666" }}>
                  Question {index + 1}
                </span>
                <span style={styles.marks}>{question.marks} marks</span>
              </div>

              <div style={styles.questionText}>{question.question_text}</div>

              {question.question_type === "multiple_choice" && (
                <div>
                  {question.options.map((option) => (
                    <label
                      key={option._id}
                      style={{
                        ...styles.option,
                        ...(answers[question._id]?.selected_option ===
                        option._id.toString()
                          ? styles.optionSelected
                          : {}),
                      }}
                    >
                      <input
                        type="radio"
                        name={`question_${question._id}`}
                        style={styles.radio}
                        checked={
                          answers[question._id]?.selected_option ===
                          option._id.toString()
                        }
                        onChange={() =>
                          handleAnswerChange(
                            question._id,
                            option.option_text,
                            option._id.toString()
                          )
                        }
                        required
                      />
                      {option.option_text}
                    </label>
                  ))}
                </div>
              )}

              {question.question_type === "true_false" && (
                <div>
                  {["True", "False"].map((option) => (
                    <label
                      key={option}
                      style={{
                        ...styles.option,
                        ...(answers[question._id]?.answer === option
                          ? styles.optionSelected
                          : {}),
                      }}
                    >
                      <input
                        type="radio"
                        name={`question_${question._id}`}
                        style={styles.radio}
                        checked={answers[question._id]?.answer === option}
                        onChange={() =>
                          handleAnswerChange(question._id, option)
                        }
                        required
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {(question.question_type === "short_answer" ||
                question.question_type === "essay") && (
                <textarea
                  style={styles.textarea}
                  placeholder="Type your answer here..."
                  value={answers[question._id]?.answer || ""}
                  onChange={(e) =>
                    handleAnswerChange(question._id, e.target.value)
                  }
                  required
                  rows={question.question_type === "essay" ? 8 : 4}
                />
              )}
            </div>
          ))}

          <div style={styles.btnContainer}>
            <button
              type="button"
              style={{ ...styles.btn, ...styles.btnSecondary }}
              onClick={() => navigate("/UserDashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ ...styles.btn, ...styles.btnPrimary }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Submit Assignment
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubmitAssignment;
