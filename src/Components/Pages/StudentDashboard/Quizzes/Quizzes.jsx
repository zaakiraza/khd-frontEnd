import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../utils/api";
import "./Quizzes.css";

const Quizzes = ({ userDetails }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    fetchQuizzes();
    fetchAttempts();
  }, [userDetails]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const classes = userDetails?.class_history || [];
      
      if (classes.length === 0) {
        setQuizzes([]);
        setLoading(false);
        return;
      }

      const currentClass = classes[classes.length - 1];
      const classId = currentClass?.class_name?._id || currentClass;
      // console.log(currentClass);
      // console.log(classId);

      const response = await api.get(`/quiz/class/${classId}`);
      if (response.data.status) {
        console.log(response);
        const publishedQuizzes = response.data.data.filter(
          (quiz) => quiz.status === "published"
        );
        setQuizzes(publishedQuizzes); 
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await api.get("/quiz-attempt/my-attempts");
      if (response.data.success) {
        setAttempts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  };

  const hasAttempted = (quizId) => {
    return attempts.some((attempt) => attempt.quiz_id._id === quizId);
  };

  const getAttemptForQuiz = (quizId) => {
    return attempts.find((attempt) => attempt.quiz_id._id === quizId);
  };

  const handleTakeQuiz = (quizId) => {
    navigate(`/UserDashboard/quiz/${quizId}`);
  };

  const handleViewResult = (quizId) => {
    navigate(`/UserDashboard/quiz/${quizId}/result`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (quiz) => {
    const now = new Date();
    const quizDate = new Date(quiz.quiz_date);
    const endTime = new Date(quiz.end_time);

    if (now < quizDate) {
      return <span className="status-badge upcoming">Upcoming</span>;
    } else if (now >= quizDate && now <= endTime) {
      return <span className="status-badge active">Active</span>;
    } else {
      return <span className="status-badge completed">Completed</span>;
    }
  };

  const availableQuizzes = quizzes.filter((quiz) => !hasAttempted(quiz._id));
  const attemptedQuizzes = quizzes.filter((quiz) => hasAttempted(quiz._id));

  if (loading) {
    return (
      <div className="quizzes-container">
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="quizzes-container">
      <div className="quizzes-header">
        <h2>My Quizzes</h2>
        <div className="quiz-stats">
          <div className="stat-item">
            <span className="stat-value">{quizzes.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{availableQuizzes.length}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{attemptedQuizzes.length}</span>
            <span className="stat-label">Attempted</span>
          </div>
        </div>
      </div>

      <div className="quiz-tabs">
        <button
          className={`tab-btn ${activeTab === "available" ? "active" : ""}`}
          onClick={() => setActiveTab("available")}
        >
          Available ({availableQuizzes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "attempted" ? "active" : ""}`}
          onClick={() => setActiveTab("attempted")}
        >
          Attempted ({attemptedQuizzes.length})
        </button>
      </div>

      <div className="quiz-list">
        {activeTab === "available" && (
          <>
            {availableQuizzes.length === 0 ? (
              <div className="empty-state">
                <p>No available quizzes at the moment</p>
              </div>
            ) : (
              availableQuizzes.map((quiz) => (
                <div key={quiz._id} className="quiz-card">
                  <div className="quiz-header">
                    <div>
                      <h3>{quiz.title}</h3>
                      <p className="quiz-subject">{quiz.subject}</p>
                    </div>
                    {getStatusBadge(quiz)}
                  </div>

                  <div className="quiz-details">
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {formatDate(quiz.quiz_date)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{quiz.duration} mins</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Marks:</span>
                      <span className="detail-value">{quiz.total_marks}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Questions:</span>
                      <span className="detail-value">
                        {quiz.questions?.length || 0}
                      </span>
                    </div>
                  </div>

                  {quiz.instructions && (
                    <div className="quiz-instructions">
                      <strong>Instructions:</strong>
                      <p>{quiz.instructions}</p>
                    </div>
                  )}

                  <div className="quiz-actions">
                    <button
                      className="btn-take-quiz"
                      onClick={() => handleTakeQuiz(quiz._id)}
                    >
                      Take Quiz
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "attempted" && (
          <>
            {attemptedQuizzes.length === 0 ? (
              <div className="empty-state">
                <p>You haven't attempted any quizzes yet</p>
              </div>
            ) : (
              attemptedQuizzes.map((quiz) => {
                const attempt = getAttemptForQuiz(quiz._id);
                return (
                  <div key={quiz._id} className="quiz-card attempted">
                    <div className="quiz-header">
                      <div>
                        <h3>{quiz.title}</h3>
                        <p className="quiz-subject">{quiz.subject}</p>
                      </div>
                      <span
                        className={`status-badge ${
                          attempt.passed ? "passed" : "failed"
                        }`}
                      >
                        {attempt.passed ? "Passed" : "Failed"}
                      </span>
                    </div>

                    <div className="quiz-details">
                      <div className="detail-item">
                        <span className="detail-label">Score:</span>
                        <span className="detail-value score">
                          {attempt.total_marks_obtained} / {quiz.total_marks}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Percentage:</span>
                        <span className="detail-value">
                          {attempt.percentage}%
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Time Taken:</span>
                        <span className="detail-value">
                          {attempt.time_taken} mins
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Submitted:</span>
                        <span className="detail-value">
                          {formatDate(attempt.submitted_at)}
                        </span>
                      </div>
                    </div>

                    {attempt.feedback && (
                      <div className="quiz-feedback">
                        <strong>Feedback:</strong>
                        <p>{attempt.feedback}</p>
                      </div>
                    )}

                    <div className="quiz-actions">
                      <button
                        className="btn-view-result"
                        onClick={() => handleViewResult(quiz._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quizzes;