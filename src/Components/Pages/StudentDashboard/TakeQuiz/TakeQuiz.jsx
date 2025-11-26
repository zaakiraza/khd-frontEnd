import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";
import "./TakeQuiz.css";

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime] = useState(new Date());
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    fetchQuiz();
    checkExistingAttempt();
  }, [quizId]);

  useEffect(() => {
    if (timeRemaining > 0 && !hasAttempted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, hasAttempted]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quiz/${quizId}`);
      if (response.data.success) {
        const quizData = response.data.data;
        setQuiz(quizData);
        setTimeRemaining(quizData.duration * 60); // Convert minutes to seconds

        // Initialize answers object
        const initialAnswers = {};
        quizData.questions.forEach((question) => {
          initialAnswers[question._id] = {
            question_id: question._id,
            answer: "",
            selected_option: "",
          };
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      showToast("Error loading quiz", "error");
      navigate("/UserDashboard");
    } finally {
      setLoading(false);
    }
  };

  const checkExistingAttempt = async () => {
    try {
      const response = await api.get(`/quiz-attempt/quiz/${quizId}`);
      if (response.data.success && response.data.data) {
        setHasAttempted(true);
        showToast("You have already attempted this quiz", "info");
        navigate("/UserDashboard");
      }
    } catch (error) {
      // No existing attempt found, continue
    }
  };

  const handleAnswerChange = (questionId, value, selectedOption = "") => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        answer: value,
        selected_option: selectedOption,
      },
    }));
  };

  const handleAutoSubmit = async () => {
    showToast("Time's up! Submitting quiz automatically...", "warning");
    await handleSubmit();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Check if all questions are answered
    const unanswered = Object.values(answers).filter(
      (ans) => !ans.answer && !ans.selected_option
    );

    if (unanswered.length > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Do you still want to submit?`
      );
      if (!confirm) return;
    }

    try {
      setSubmitting(true);

      // Calculate time taken in minutes
      const endTime = new Date();
      const timeTakenMinutes = Math.round((endTime - startTime) / 60000);

      const submissionData = {
        quiz_id: quizId,
        answers: Object.values(answers),
        time_taken: timeTakenMinutes,
      };

      const response = await api.post("/quiz-attempt/submit", submissionData);

      if (response.data.success) {
        const result = response.data.data;
        showToast(
          `Quiz submitted successfully! Score: ${result.total_marks_obtained}/${quiz.total_marks}`,
          "success"
        );
        navigate("/UserDashboard");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      showToast(
        error.response?.data?.message || "Error submitting quiz",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    const percentRemaining = (timeRemaining / (quiz.duration * 60)) * 100;
    if (percentRemaining > 50) return "#22c55e";
    if (percentRemaining > 25) return "#f59e0b";
    return "#ef4444";
  };

  if (loading) {
    return (
      <div className="take-quiz-container">
        <div className="loading-state">
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="take-quiz-container">
        <div className="error-state">
          <p>Quiz not found</p>
          <button onClick={() => navigate("/UserDashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="take-quiz-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>{quiz.title}</h1>
          <p className="quiz-meta">
            {quiz.subject} • {quiz.total_marks} marks • {quiz.questions.length}{" "}
            questions
          </p>
        </div>
        <div className="timer" style={{ color: getTimeColor() }}>
          <span className="timer-label">Time Remaining:</span>
          <span className="timer-value">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {quiz.instructions && (
        <div className="quiz-instructions-box">
          <h3>Instructions:</h3>
          <p>{quiz.instructions}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="quiz-form">
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="question-card">
            <div className="question-header">
              <span className="question-number">Question {index + 1}</span>
              <span className="question-marks">{question.marks} marks</span>
            </div>

            <p className="question-text">{question.question_text}</p>

            {question.question_type === "multiple_choice" && (
              <div className="options-container">
                {question.options.map((option) => (
                  <label key={option._id} className="option-label">
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={option.option_text}
                      checked={
                        answers[question._id]?.selected_option === option._id
                      }
                      onChange={() =>
                        handleAnswerChange(
                          question._id,
                          option.option_text,
                          option._id
                        )
                      }
                      className="option-radio"
                    />
                    <span className="option-text">{option.option_text}</span>
                  </label>
                ))}
              </div>
            )}

            {question.question_type === "true_false" && (
              <div className="options-container">
                <label className="option-label">
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value="true"
                    checked={answers[question._id]?.answer === "true"}
                    onChange={() => handleAnswerChange(question._id, "true")}
                    className="option-radio"
                  />
                  <span className="option-text">True</span>
                </label>
                <label className="option-label">
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value="false"
                    checked={answers[question._id]?.answer === "false"}
                    onChange={() => handleAnswerChange(question._id, "false")}
                    className="option-radio"
                  />
                  <span className="option-text">False</span>
                </label>
              </div>
            )}

            {question.question_type === "short_answer" && (
              <input
                type="text"
                value={answers[question._id]?.answer || ""}
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
                placeholder="Enter your answer..."
                className="short-answer-input"
              />
            )}

            {question.question_type === "essay" && (
              <textarea
                value={answers[question._id]?.answer || ""}
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
                placeholder="Write your essay here..."
                rows={6}
                className="essay-textarea"
              />
            )}
          </div>
        ))}

        <div className="quiz-footer">
          <button
            type="button"
            onClick={() => navigate("/UserDashboard")}
            className="btn-cancel"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeQuiz;
