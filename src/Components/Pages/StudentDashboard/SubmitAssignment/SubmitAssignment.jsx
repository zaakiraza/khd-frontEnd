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
      <div className="submit-assignment-container">
        <div className="submit-assignment-card">
          <div className="submit-assignment-loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading assignment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="submit-assignment-container">
        <div className="submit-assignment-card">
          <p>Assignment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-assignment-container">
      {existingSubmission && (
        <div className="submit-assignment-submitted-banner">
          <strong>✓ Already Submitted</strong>
          <p className="submit-assignment-submission-info">
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

      <div className="submit-assignment-card">
        <div className="submit-assignment-header">
          <h1 className="submit-assignment-title">{assignment.title}</h1>
          <div className="submit-assignment-meta">
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
          <div className="submit-assignment-description">
            <strong>Description:</strong>
            <p>{assignment.description}</p>
          </div>
        )}
      </div>

      {!existingSubmission && (
        <form onSubmit={handleSubmit}>
          {assignment.questions.map((question, index) => (
            <div key={question._id} className="submit-assignment-question-card">
              <div className="submit-assignment-question-header">
                <span className="submit-assignment-question-number">
                  Question {index + 1}
                </span>
                <span className="submit-assignment-marks">{question.marks} marks</span>
              </div>

              <div className="submit-assignment-question-text">{question.question_text}</div>

              {question.question_type === "multiple_choice" && (
                <div>
                  {question.options.map((option) => (
                    <label
                      key={option._id}
                      className={`submit-assignment-option ${
                        answers[question._id]?.selected_option === option._id.toString()
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question_${question._id}`}
                        className="submit-assignment-radio"
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
                      className={`submit-assignment-option ${
                        answers[question._id]?.answer === option ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question_${question._id}`}
                        className="submit-assignment-radio"
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
                  className="submit-assignment-textarea"
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

          <div className="submit-assignment-btn-container">
            <button
              type="button"
              className="submit-assignment-btn submit-assignment-btn-secondary"
              onClick={() => navigate("/UserDashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-assignment-btn submit-assignment-btn-primary"
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
