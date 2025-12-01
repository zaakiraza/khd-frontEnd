import React, { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./Exams.css";

const Exams = ({ userDetails }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  const [selectedExam, setSelectedExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [attemptedExams, setAttemptedExams] = useState({});

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
    filterBar: {
      display: "flex",
      gap: 8,
      marginBottom: 12,
    },
    filterBtn: (active) => ({
      padding: "6px 12px",
      borderRadius: 6,
      border: active ? "1px solid #293c5d" : "1px solid #ddd",
      background: active ? "#293c5d" : "#f7f7f7",
      color: active ? "#fff" : "#333",
      cursor: "pointer",
      fontSize: 13,
    }),
    examCard: {
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      background: "#fafafa",
    },
    examHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      fontSize: 15,
      fontWeight: 600,
      color: "#111",
    },
    badge: (status) => {
      const colors = {
        scheduled: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
        ongoing: { bg: "#fef3c7", color: "#a16207", border: "#fde047" },
        completed: { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
        cancelled: { bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" },
      };
      const c = colors[status] || colors.scheduled;
      return {
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
      };
    },
    meta: {
      display: "flex",
      gap: 12,
      fontSize: 12,
      color: "#666",
      marginBottom: 8,
      flexWrap: "wrap",
    },
    loading: {
      textAlign: "center",
      padding: 20,
      color: "#666",
    },
    takeExamBtn: {
      padding: "8px 16px",
      background: "linear-gradient(135deg, #2eab2e 0%, #1e7e34 100%)",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    examModal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: 20,
    },
    examContainer: {
      background: "#fff",
      borderRadius: 12,
      width: "100%",
      maxWidth: 900,
      maxHeight: "90vh",
      overflow: "auto",
      padding: 24,
    },
    examHeader: {
      borderBottom: "2px solid #e5e7eb",
      paddingBottom: 16,
      marginBottom: 20,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    timer: {
      fontSize: 18,
      fontWeight: 700,
      color: "#ef4444",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    questionCard: {
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      background: "#fafafa",
    },
    submitBtn: {
      padding: "12px 24px",
      background: "linear-gradient(135deg, #2eab2e 0%, #1e7e34 100%)",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 15,
      fontWeight: 600,
      width: "100%",
      marginTop: 20,
    },
    closeBtn: {
      padding: "8px 16px",
      background: "#6b7280",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
    },
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (exams.length > 0) {
      checkAttemptedExams();
    }
  }, [exams]);

  useEffect(() => {
    if (examStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining]);

  useEffect(() => {
    if (examStarted) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          toast.showWarning("Tab switched! Auto-submitting exam...");
          setTimeout(() => {
            handleAutoSubmitOnTabSwitch();
          }, 1000);
        }
      };

      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue =
          "Your exam is in progress. Leaving will auto-submit your exam.";
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [examStarted, answers]);

  const fetchExams = async () => {
    try {
      setLoading(true);

      // Try to get exams for user's class
      const classHistory = userDetails?.class_history || [];
      const currentClass = classHistory.find((ch) => ch.status === "active");

      let url = "/exam-schedule";
      if (currentClass?.class_name?._id) {
        url = `/exam-schedule/class/${currentClass.class_name._id}`;
      }

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExams(response.data.data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.showError("Failed to fetch exam schedules");
    } finally {
      setLoading(false);
    }
  };

  const checkAttemptedExams = async () => {
    try {
      const attempts = {};
      for (const exam of exams) {
        const response = await api.get(`/result/check-attempt/${exam._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.attempted) {
          attempts[exam._id] = true;
        }
      }
      setAttemptedExams(attempts);
    } catch (error) {
      console.error("Error checking exam attempts:", error);
    }
  };

  const getFilteredExams = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (filter) {
      case "upcoming":
        return exams.filter((e) => {
          const examDate = new Date(e.exam_date);
          return examDate >= now && e.status === "scheduled";
        });
      case "completed":
        return exams.filter((e) => e.status === "completed");
      case "all":
      default:
        return exams;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStartExam = async (exam) => {
    // Check if already attempted
    if (attemptedExams[exam._id]) {
      toast.showError("You have already submitted this exam");
      return;
    }

    if (!exam.questions || exam.questions.length === 0) {
      toast.showError("This exam has no questions yet");
      return;
    }

    setSelectedExam(exam);
    setExamQuestions(exam.questions);
    setTimeRemaining(exam.duration * 60);
    setExamStarted(true);
    setAnswers({});
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    });
  };

  const handleSubmitExam = async () => {
    if (!window.confirm("Are you sure you want to submit the exam?")) {
      return;
    }

    try {
      // Calculate score for auto-graded questions
      let totalScore = 0;
      const submissionAnswers = examQuestions.map((q, index) => {
        const studentAnswer = answers[index] || "";
        let isCorrect = false;

        if (q.question_type === "mcq" || q.question_type === "true_false") {
          isCorrect =
            studentAnswer.toLowerCase() === q.correct_answer.toLowerCase();
          if (isCorrect) {
            totalScore += parseFloat(q.marks);
          }
        }

        return {
          question_text: q.question_text,
          question_type: q.question_type,
          student_answer: studentAnswer,
          correct_answer: q.correct_answer,
          marks_obtained: isCorrect ? q.marks : 0,
        };
      });

      // Get current class info
      const classHistory = userDetails?.class_history || [];
      const currentClass = classHistory.find((ch) => ch.status === "active");

      // Submit result to backend
      const resultResponse = await api.post(
        "/result/submit-exam",
        {
          exam_id: selectedExam._id,
          exam_name: selectedExam.exam_name,
          class_id: currentClass?.class_name?._id || selectedExam.class_id,
          subject: selectedExam.subject,
          marks_obtained: totalScore,
          total_marks: selectedExam.total_marks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (resultResponse.data.success) {
        toast.showSuccess(
          `Exam submitted! Your score: ${totalScore}/${selectedExam.total_marks}`
        );

        // Mark this exam as attempted
        setAttemptedExams((prev) => ({ ...prev, [selectedExam._id]: true }));
      } else {
        toast.showError(resultResponse.data.message || "Failed to submit exam");
      }

      // Reset exam state
      setSelectedExam(null);
      setExamStarted(false);
      setExamQuestions([]);
      setAnswers({});
      setTimeRemaining(null);

      fetchExams();
    } catch (error) {
      console.error("Error submitting exam:", error);
      if (error.response?.data?.message) {
        toast.showError(error.response.data.message);
      } else {
        toast.showError("Failed to submit exam");
      }

      // Still close the exam modal
      setSelectedExam(null);
      setExamStarted(false);
      setExamQuestions([]);
      setAnswers({});
      setTimeRemaining(null);
    }
  };

  const handleAutoSubmitOnTabSwitch = async () => {
    try {
      // Calculate score for auto-graded questions
      let totalScore = 0;
      const submissionAnswers = examQuestions.map((q, index) => {
        const studentAnswer = answers[index] || "";
        let isCorrect = false;

        if (q.question_type === "mcq" || q.question_type === "true_false") {
          isCorrect =
            studentAnswer.toLowerCase() === q.correct_answer.toLowerCase();
          if (isCorrect) {
            totalScore += parseFloat(q.marks);
          }
        }

        return {
          question_text: q.question_text,
          question_type: q.question_type,
          student_answer: studentAnswer,
          correct_answer: q.correct_answer,
          marks_obtained: isCorrect ? q.marks : 0,
        };
      });

      // Get current class info
      const classHistory = userDetails?.class_history || [];
      const currentClass = classHistory.find((ch) => ch.status === "active");

      // Submit result to backend
      await api.post(
        "/result/submit-exam",
        {
          exam_id: selectedExam._id,
          exam_name: selectedExam.exam_name,
          class_id: currentClass?.class_name?._id || selectedExam.class_id,
          subject: selectedExam.subject,
          marks_obtained: totalScore,
          total_marks: selectedExam.total_marks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.showWarning(
        `Exam auto-submitted due to tab switch! Score: ${totalScore}/${selectedExam.total_marks}`
      );

      // Mark this exam as attempted
      setAttemptedExams((prev) => ({ ...prev, [selectedExam._id]: true }));

      // Reset exam state
      setSelectedExam(null);
      setExamStarted(false);
      setExamQuestions([]);
      setAnswers({});
      setTimeRemaining(null);

      fetchExams();
    } catch (error) {
      console.error("Error auto-submitting exam:", error);
      // Still close the exam
      setSelectedExam(null);
      setExamStarted(false);
      setExamQuestions([]);
      setAnswers({});
      setTimeRemaining(null);
    }
  };

  const handleCloseExam = () => {
    if (
      examStarted &&
      !window.confirm("Are you sure? Your progress will be lost.")
    ) {
      return;
    }
    setSelectedExam(null);
    setExamStarted(false);
    setExamQuestions([]);
    setAnswers({});
    setTimeRemaining(null);
  };

  const filteredExams = getFilteredExams();

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i> Loading exams...
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.h2}>
            <i className="fas fa-graduation-cap"></i> Exam Schedule
          </h2>
        </div>

        <div style={styles.filterBar}>
          <button
            style={styles.filterBtn(filter === "upcoming")}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            style={styles.filterBtn(filter === "completed")}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            style={styles.filterBtn(filter === "all")}
            onClick={() => setFilter("all")}
          >
            All ({exams.length})
          </button>
        </div>

        {filteredExams.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
            <i
              className="fas fa-calendar-times"
              style={{ fontSize: 40, marginBottom: 10 }}
            ></i>
            <p>No exams found</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam._id} style={styles.examCard}>
              <div style={styles.examHeader}>
                <div style={styles.title}>{exam.exam_name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={styles.badge(exam.status)}>{exam.status}</span>
                  {attemptedExams[exam._id] && (
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                        background: "#dcfce7",
                        color: "#15803d",
                        border: "1px solid #86efac",
                      }}
                    >
                      ✓ Submitted
                    </span>
                  )}
                  {exam.status === "ongoing" && !attemptedExams[exam._id] && (
                    <button
                      style={styles.takeExamBtn}
                      onClick={() => handleStartExam(exam)}
                    >
                      <i className="fas fa-play"></i> Take Exam
                    </button>
                  )}
                  {exam.status === "ongoing" && attemptedExams[exam._id] && (
                    <button
                      style={{
                        ...styles.takeExamBtn,
                        background: "#9ca3af",
                        cursor: "not-allowed",
                      }}
                      disabled
                    >
                      <i className="fas fa-check"></i> Already Submitted
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.meta}>
                <span>
                  <i className="fas fa-book"></i> {exam.subject}
                </span>
                <span>
                  <i className="fas fa-calendar"></i>{" "}
                  {formatDate(exam.exam_date)}
                </span>
                <span>
                  <i className="fas fa-clock"></i> {formatTime(exam.start_time)}{" "}
                  - {formatTime(exam.end_time)}
                </span>
                <span>
                  <i className="fas fa-hourglass-half"></i> {exam.duration} mins
                </span>
                <span>
                  <i className="fas fa-star"></i> {exam.total_marks} marks
                  (Pass: {exam.passing_marks})
                </span>
                <span>
                  <i className="fas fa-question-circle"></i>{" "}
                  {exam.questions?.length || 0} questions
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Exam Modal */}
      {selectedExam && (
        <div style={styles.examModal} onClick={handleCloseExam}>
          <div
            style={styles.examContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.examHeader}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>
                  {selectedExam.exam_name}
                </h2>
                <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>
                  {selectedExam.subject} • {selectedExam.total_marks} marks
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={styles.timer}>
                  <i className="fas fa-clock"></i>
                  {formatTimer(timeRemaining)}
                </div>
                <button style={styles.closeBtn} onClick={handleCloseExam}>
                  <i className="fas fa-times"></i> Close
                </button>
              </div>
            </div>

            {examQuestions.map((question, index) => (
              <div key={index} style={styles.questionCard}>
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ color: "#2eab2e" }}>
                    Question {index + 1}
                  </strong>
                  <span style={{ marginLeft: 8, color: "#666", fontSize: 13 }}>
                    ({question.marks} {question.marks === 1 ? "mark" : "marks"})
                  </span>
                </div>
                <p style={{ marginBottom: 16, fontSize: 15, lineHeight: 1.6 }}>
                  {question.question_text}
                </p>

                {question.question_type === "mcq" && (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: 10,
                          background:
                            answers[index] ===
                            String.fromCharCode(65 + optIndex)
                              ? "#e0f2e9"
                              : "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={String.fromCharCode(65 + optIndex)}
                          checked={
                            answers[index] ===
                            String.fromCharCode(65 + optIndex)
                          }
                          onChange={(e) =>
                            handleAnswerChange(index, e.target.value)
                          }
                        />
                        <span style={{ fontSize: 14 }}>
                          <strong>{String.fromCharCode(65 + optIndex)}.</strong>{" "}
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {question.question_type === "true_false" && (
                  <div style={{ display: "flex", gap: 12 }}>
                    <label
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: 12,
                        background:
                          answers[index] === "true" ? "#e0f2e9" : "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value="true"
                        checked={answers[index] === "true"}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                      />
                      <span style={{ fontWeight: 600 }}>True</span>
                    </label>
                    <label
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: 12,
                        background:
                          answers[index] === "false" ? "#e0f2e9" : "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value="false"
                        checked={answers[index] === "false"}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                      />
                      <span style={{ fontWeight: 600 }}>False</span>
                    </label>
                  </div>
                )}

                {question.question_type === "short_answer" && (
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: 10,
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      fontSize: 14,
                    }}
                    placeholder="Enter your answer..."
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                )}

                {question.question_type === "essay" && (
                  <textarea
                    style={{
                      width: "100%",
                      padding: 10,
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      fontSize: 14,
                      minHeight: 120,
                      resize: "vertical",
                    }}
                    placeholder="Write your answer here..."
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                )}
              </div>
            ))}

            <button style={styles.submitBtn} onClick={handleSubmitExam}>
              <i className="fas fa-paper-plane"></i> Submit Exam
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Exams;
