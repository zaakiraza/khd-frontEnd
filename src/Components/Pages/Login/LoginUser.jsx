import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginUser.css";
import axios from "axios";
import { useToast } from "../../Common/Toast/ToastContext";

function Login() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const logo = "/logo.png";

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!email || !password) {
      toast.showWarning("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.showWarning("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      toast.showWarning("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    try {
      const api = await axios.post(`${BASEURL}/auth/login`, {
        email,
        password,
      });
      if (api.data.status) {
        localStorage.setItem("token", api.data.data);
        toast.showSuccess(api.data.message);
        setTimeout(() => {
          navigate("/UserDashboard");
        }, 1000);
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
      toast.showError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main">
      <div className="form_box">
        <div className="logo">
          <img src={logo} alt="" />
          <h1>Khuddam User Login</h1>
        </div>
        <form className="form_user" onSubmit={formHandler}>
          <div className="input-group">
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={handleEmailChange}
                className={emailError ? "input-error" : ""}
              />
            </div>
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <div className="input-group">
            <div className="input-wrapper password-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={handlePasswordChange}
                className={passwordError ? "input-error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>

          <button
            className="btnLogin"
            type="submit"
            disabled={isSubmitting || emailError || passwordError}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Logging in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Login
              </>
            )}
          </button>
        </form>
        <Link className="lst_anker" to={"/"}>
          Back To Home
        </Link>
      </div>
    </div>
  );
}

export default Login;
