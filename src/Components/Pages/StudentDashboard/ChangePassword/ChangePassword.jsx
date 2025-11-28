import React, { useState } from "react";
import "./ChangePassword.css";
import api from "../../../../utils/api";
import { useToast } from "../../../Common/Toast/ToastContext";

const ChangePassword = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      errors: [
        ...(password.length < minLength ? [`Password must be at least ${minLength} characters long`] : []),
        ...(!hasUpperCase ? ["Password must contain at least one uppercase letter"] : []),
        ...(!hasLowerCase ? ["Password must contain at least one lowercase letter"] : []),
        ...(!hasNumbers ? ["Password must contain at least one number"] : [])
      ]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.showError("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.showError("New passwords do not match");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      toast.showError("New password must be different from the current password");
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      toast.showError(passwordValidation.errors[0]);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/change_password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (response.status === 200) {
        toast.showSuccess(response.data.message || "Password changed successfully!");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      const errorMessage = error.response?.data?.message || "Failed to change password. Please try again.";
      toast.showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const passwordValidation = validatePassword(formData.newPassword);

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="change-password-header">
          <div className="change-password-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h2 className="change-password-title">Change Password</h2>
          <p className="change-password-subtitle">
            Update your password to keep your account secure
          </p>
        </div>

        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="change-password-field-group">
            <label className="change-password-label">
              <span className="change-password-label-text">
                <i className="fas fa-lock"></i>
                Current Password
              </span>
              <div className="change-password-input-wrapper">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="change-password-input"
                  placeholder="Enter your current password"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="change-password-toggle-btn"
                  onClick={() => togglePasswordVisibility('old')}
                  disabled={loading}
                  tabIndex="-1"
                >
                  <i className={`fas ${showPasswords.old ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </label>
          </div>

          <div className="change-password-field-group">
            <label className="change-password-label">
              <span className="change-password-label-text">
                <i className="fas fa-key"></i>
                New Password
              </span>
              <div className="change-password-input-wrapper">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="change-password-input"
                  placeholder="Enter your new password"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="change-password-toggle-btn"
                  onClick={() => togglePasswordVisibility('new')}
                  disabled={loading}
                  tabIndex="-1"
                >
                  <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </label>
            
            {formData.newPassword && (
              <div className="password-strength">
                <div className="password-requirements">
                  <div className={`requirement ${formData.newPassword.length >= 8 ? 'valid' : 'invalid'}`}>
                    <i className={`fas ${formData.newPassword.length >= 8 ? 'fa-check' : 'fa-times'}`}></i>
                    At least 8 characters
                  </div>
                  <div className={`requirement ${/[A-Z]/.test(formData.newPassword) ? 'valid' : 'invalid'}`}>
                    <i className={`fas ${/[A-Z]/.test(formData.newPassword) ? 'fa-check' : 'fa-times'}`}></i>
                    One uppercase letter
                  </div>
                  <div className={`requirement ${/[a-z]/.test(formData.newPassword) ? 'valid' : 'invalid'}`}>
                    <i className={`fas ${/[a-z]/.test(formData.newPassword) ? 'fa-check' : 'fa-times'}`}></i>
                    One lowercase letter
                  </div>
                  <div className={`requirement ${/\d/.test(formData.newPassword) ? 'valid' : 'invalid'}`}>
                    <i className={`fas ${/\d/.test(formData.newPassword) ? 'fa-check' : 'fa-times'}`}></i>
                    One number
                  </div>
                </div>
                <div className="password-strength-bar">
                  <div 
                    className={`password-strength-fill ${passwordValidation.isValid ? 'strong' : formData.newPassword.length > 4 ? 'medium' : 'weak'}`}
                    style={{ 
                      width: `${Math.min((passwordValidation.errors.length === 0 ? 100 : Math.max(25, 100 - (passwordValidation.errors.length * 25))), 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="change-password-field-group">
            <label className="change-password-label">
              <span className="change-password-label-text">
                <i className="fas fa-check-double"></i>
                Confirm New Password
              </span>
              <div className="change-password-input-wrapper">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="change-password-input"
                  placeholder="Confirm your new password"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="change-password-toggle-btn"
                  onClick={() => togglePasswordVisibility('confirm')}
                  disabled={loading}
                  tabIndex="-1"
                >
                  <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </label>
            
            {formData.confirmPassword && (
              <div className="password-match">
                {formData.newPassword === formData.confirmPassword ? (
                  <div className="match-indicator valid">
                    <i className="fas fa-check"></i>
                    Passwords match
                  </div>
                ) : (
                  <div className="match-indicator invalid">
                    <i className="fas fa-times"></i>
                    Passwords do not match
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="change-password-actions">
            <button
              type="submit"
              className="change-password-btn change-password-btn-primary"
              disabled={loading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Changing Password...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Change Password
                </>
              )}
            </button>
            
            <button
              type="button"
              className="change-password-btn change-password-btn-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              <i className="fas fa-undo"></i>
              Reset Form
            </button>
          </div>
        </form>

        <div className="change-password-security-tips">
          <h3>Security Tips:</h3>
          <ul>
            <li><i className="fas fa-lightbulb"></i> Use a unique password that you don't use elsewhere</li>
            <li><i className="fas fa-shield-alt"></i> Include a mix of letters, numbers, and special characters</li>
            <li><i className="fas fa-clock"></i> Change your password regularly</li>
            <li><i className="fas fa-user-secret"></i> Never share your password with anyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;