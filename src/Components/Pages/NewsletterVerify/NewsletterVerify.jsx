import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NewsletterVerify.css";
import api from "../../../utils/api";

const NewsletterVerify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        const response = await api.get(`/newsletter/verify/${token}`);
        
        if (response.status === 200) {
          setStatus("success");
          setMessage(response.data.message || "Email successfully verified! You are now subscribed to our newsletter.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again later or contact support.";
        setMessage(errorMessage);
      }
    };

    if (token) {
      verifySubscription();
    } else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [token]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="newsletter-verify">
      <div className="verify-container">
        <div className="verify-card">
          {status === "verifying" && (
            <div className="verify-content">
              <div className="loading-spinner"></div>
              <h2>Verifying Your Subscription</h2>
              <p>Please wait while we verify your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="verify-content success">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Welcome to Khuddam Learning!</h2>
              <p className="success-message">{message}</p>
              <div className="benefits">
                <h3>What you'll receive:</h3>
                <ul>
                  <li><i className="fas fa-graduation-cap"></i> New course announcements</li>
                  <li><i className="fas fa-calendar-alt"></i> Class schedules and updates</li>
                  <li><i className="fas fa-trophy"></i> Student achievements and results</li>
                  <li><i className="fas fa-bell"></i> Important educational events</li>
                </ul>
              </div>
              <div className="action-buttons">
                <button onClick={handleGoHome} className="btn-primary">
                  <i className="fas fa-home"></i>
                  Go to Homepage
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="verify-content error">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h2>Verification Failed</h2>
              <p className="error-message">{message}</p>
              <div className="help-section">
                <h3>Need help?</h3>
                <p>If you continue to have issues, please:</p>
                <ul>
                  <li>Check if the verification link is complete</li>
                  <li>Try subscribing again from our homepage</li>
                  <li>Contact our support team if the problem persists</li>
                </ul>
              </div>
              <div className="action-buttons">
                <button onClick={handleGoHome} className="btn-primary">
                  <i className="fas fa-home"></i>
                  Go to Homepage
                </button>
                <button onClick={handleGoBack} className="btn-secondary">
                  <i className="fas fa-arrow-left"></i>
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="footer-info">
          <p>
            <i className="fas fa-envelope"></i>
            Questions? Contact us at{" "}
            <a href="mailto:info@khuddam.edu">info@khuddam.edu</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterVerify;