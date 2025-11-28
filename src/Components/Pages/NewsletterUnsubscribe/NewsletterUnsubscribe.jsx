import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./NewsletterUnsubscribe.css";
import api from "../../../utils/api";

const NewsletterUnsubscribe = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam || tokenParam) {
      handleUnsubscribe(emailParam, tokenParam);
    } else {
      setStatus("form");
    }
  }, [searchParams]);

  const handleUnsubscribe = async (emailParam, tokenParam) => {
    try {
      setStatus("loading");
      
      const params = {};
      if (emailParam) params.email = emailParam;
      if (tokenParam) params.token = tokenParam;

      const response = await api.get('/newsletter/unsubscribe', { params });

      if (response.status === 200) {
        setStatus("success");
        setMessage(response.data.message || "Successfully unsubscribed from newsletter.");
        setEmail(response.data.data?.email || emailParam || "");
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      setStatus("error");
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again later.";
      setMessage(errorMessage);
    }
  };

  const handleManualUnsubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    await handleUnsubscribe(email, null);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleResubscribe = () => {
    navigate("/#newsletter");
  };

  return (
    <div className="newsletter-unsubscribe">
      <div className="unsubscribe-container">
        <div className="unsubscribe-card">
          {status === "loading" && (
            <div className="unsubscribe-content">
              <div className="loading-spinner"></div>
              <h2>Processing Your Request</h2>
              <p>Please wait while we unsubscribe you from our newsletter...</p>
            </div>
          )}

          {status === "form" && (
            <div className="unsubscribe-content form">
              <div className="form-icon">
                <i className="fas fa-envelope-open"></i>
              </div>
              <h2>Unsubscribe from Newsletter</h2>
              <p>Enter your email address to unsubscribe from our newsletter.</p>
              
              <form onSubmit={handleManualUnsubscribe} className="unsubscribe-form">
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-user-minus"></i>
                  Unsubscribe
                </button>
              </form>

              {message && (
                <div className="message error">
                  {message}
                </div>
              )}

              <div className="form-footer">
                <p>
                  Changed your mind?{" "}
                  <button onClick={handleGoHome} className="link-button">
                    Go back to homepage
                  </button>
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="unsubscribe-content success">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Successfully Unsubscribed</h2>
              <p className="success-message">{message}</p>
              
              {email && (
                <div className="email-info">
                  <p><strong>{email}</strong> has been removed from our newsletter.</p>
                </div>
              )}

              <div className="sorry-section">
                <h3>We're sorry to see you go!</h3>
                <p>You will no longer receive our newsletter updates. If you change your mind, you can always subscribe again.</p>
              </div>

              <div className="action-buttons">
                <button onClick={handleResubscribe} className="btn-primary">
                  <i className="fas fa-undo"></i>
                  Subscribe Again
                </button>
                <button onClick={handleGoHome} className="btn-secondary">
                  <i fas="fas fa-home"></i>
                  Go to Homepage
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="unsubscribe-content error">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h2>Unsubscribe Failed</h2>
              <p className="error-message">{message}</p>
              
              <div className="help-section">
                <h3>Need help?</h3>
                <p>If you continue to have issues, please:</p>
                <ul>
                  <li>Make sure you're using the correct email address</li>
                  <li>Check if the unsubscribe link is complete</li>
                  <li>Contact our support team for assistance</li>
                </ul>
              </div>

              <div className="action-buttons">
                <button onClick={() => setStatus("form")} className="btn-primary">
                  <i className="fas fa-retry"></i>
                  Try Again
                </button>
                <button onClick={handleGoHome} className="btn-secondary">
                  <i className="fas fa-home"></i>
                  Go to Homepage
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

export default NewsletterUnsubscribe;