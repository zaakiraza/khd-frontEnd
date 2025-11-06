import React, { useState } from "react";
import { useToast } from "../../../Common/Toast/ToastContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = ({ userDetails }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    personal: false,
    academic: false,
    guardian: false,
    previous: false,
    bank: false,
  });

  const personal = userDetails?.personal_info || {};
  const guardian = userDetails?.guardian_info || {};
  const academic = userDetails?.academic_progress || {};
  const previous = userDetails?.previous_madrassa || {};
  const bank = userDetails?.bank_info || {};

  const fullName =
    `${personal.first_name || ""} ${personal.last_name || ""}`.trim() ||
    "Student";
  const profileImg = personal.img_URL || "/logo.png";

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusClass =
      status === "active" ? "status-active" : "status-inactive";
    return (
      <span className={`status-badge ${statusClass}`}>
        {status || "pending"}
      </span>
    );
  };

  const getVerifiedBadge = (verified) => {
    return verified ? (
      <span className="verified-badge">
        <i className="fas fa-check-circle"></i> Verified
      </span>
    ) : (
      <span className="unverified-badge">
        <i className="fas fa-exclamation-triangle"></i> Unverified
      </span>
    );
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    // Simple logout without confirmation
    localStorage.removeItem("token");
    toast.showSuccess("Logged out successfully!", 1500);
    setTimeout(() => {
      navigate("/login-student");
    }, 1000);
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header-section">
        <div className="profile-avatar-container">
          <img
            src={profileImg}
            alt={fullName}
            className="profile-avatar-large"
            onError={(e) => {
              e.target.src = "/logo.png";
            }}
          />
          {getVerifiedBadge(personal.verified)}
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">{fullName}</h1>
          <div className="profile-meta">
            <span className="meta-item">
              <i className="fas fa-id-card"></i> <strong>Roll No:</strong>{" "}
              {personal.rollNo || "-"}
            </span>
            <span className="meta-divider">•</span>
            <span className="meta-item">{getStatusBadge(personal.status)}</span>
            <span className="meta-divider">•</span>
            <span className="meta-item">
              <i className="fas fa-calendar-alt"></i> <strong>Enrolled:</strong>{" "}
              {personal.enrolled_year || "-"}
            </span>
          </div>
          <div className="profile-contact-quick">
            <span>
              <i className="fas fa-envelope"></i> {personal.email || "-"}
            </span>
            <span>
              <i className="fab fa-whatsapp"></i> {personal.whatsapp_no || "-"}
            </span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* Accordion Sections */}
      <div className="accordion-container">
        {/* Personal Information Accordion */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection("personal")}
          >
            <span className="accordion-title">
              <i className="fas fa-user"></i> Personal Information
            </span>
            <i
              className={`fas fa-chevron-${
                openSections.personal ? "up" : "down"
              } accordion-icon`}
            ></i>
          </button>
          <div
            className={`accordion-content ${
              openSections.personal ? "open" : ""
            }`}
          >
            <div className="accordion-body">
              <div className="info-row">
                <InfoField label="First Name" value={personal.first_name} />
                <InfoField label="Last Name" value={personal.last_name} />
              </div>
              <div className="info-row">
                <InfoField label="Father's Name" value={personal.father_name} />
                <InfoField label="Gender" value={personal.gender} />
              </div>
              <div className="info-row">
                <InfoField
                  label="Date of Birth"
                  value={formatDate(personal.dob)}
                />
                <InfoField label="Age" value={`${personal.age} years`} />
              </div>
              <div className="info-row">
                <InfoField label="CNIC" value={personal.CNIC} />
                <InfoField
                  label="Marj-e-Taqleed"
                  value={personal.marj_e_taqleed}
                />
              </div>
              <div className="info-row">
                <InfoField label="WhatsApp" value={personal.whatsapp_no} />
                <InfoField
                  label="Alternative Phone"
                  value={personal.alternative_no}
                />
              </div>
              <div className="info-row">
                <InfoField label="Email" value={personal.email} fullWidth />
              </div>
              <div className="info-row">
                <InfoField label="Address" value={personal.address} fullWidth />
              </div>
              <div className="info-row">
                <InfoField label="City" value={personal.city} />
                <InfoField label="Country" value={personal.country} />
              </div>
              {personal.doc_img && (
                <div className="info-row">
                  <div className="document-preview">
                    <label className="info-label">Document</label>
                    <a
                      href={personal.doc_img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doc-link"
                    >
                      <i className="fas fa-file-alt"></i> View Document
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Academic Progress Accordion */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection("academic")}
          >
            <span className="accordion-title">
              <i className="fas fa-graduation-cap"></i> Academic Progress
            </span>
            <i
              className={`fas fa-chevron-${
                openSections.academic ? "up" : "down"
              } accordion-icon`}
            ></i>
          </button>
          <div
            className={`accordion-content ${
              openSections.academic ? "open" : ""
            }`}
          >
            <div className="accordion-body">
              <div className="info-row">
                <InfoField
                  label="Current Class"
                  value={academic.academic_class}
                />
                <InfoField label="Institute" value={academic.institute_name} />
              </div>
              <div className="info-row">
                <InfoField
                  label="Result"
                  value={academic.result || "Not Available"}
                />
                <InfoField
                  label="Status"
                  value={academic.inProgress ? "In Progress" : "Completed"}
                />
              </div>
              <div className="info-row">
                <InfoField
                  label="Enrolled Class"
                  value={personal.enrolled_class || "Not Assigned"}
                />
                <InfoField
                  label="Application Status"
                  value={personal.application_status}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Guardian Information Accordion */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection("guardian")}
          >
            <span className="accordion-title">
              <i className="fas fa-users"></i> Guardian Info
            </span>
            <i
              className={`fas fa-chevron-${
                openSections.guardian ? "up" : "down"
              } accordion-icon`}
            ></i>
          </button>
          <div
            className={`accordion-content ${
              openSections.guardian ? "open" : ""
            }`}
          >
            <div className="accordion-body">
              <div className="info-row">
                <InfoField label="Name" value={guardian.name} />
                <InfoField label="Relationship" value={guardian.relationship} />
              </div>
              <div className="info-row">
                <InfoField label="WhatsApp" value={guardian.whatsapp_no} />
                <InfoField label="CNIC" value={guardian.CNIC} />
              </div>
              <div className="info-row">
                <InfoField label="Email" value={guardian.email} fullWidth />
              </div>
              <div className="info-row">
                <InfoField label="Address" value={guardian.address} fullWidth />
              </div>
            </div>
          </div>
        </div>

        {/* Previous Madrassa Accordion */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection("previous")}
          >
            <span className="accordion-title">
              <i className="fas fa-mosque"></i> Previous Madrassa (Optional)
            </span>
            <i
              className={`fas fa-chevron-${
                openSections.previous ? "up" : "down"
              } accordion-icon`}
            ></i>
          </button>
          <div
            className={`accordion-content ${
              openSections.previous ? "open" : ""
            }`}
          >
            <div className="accordion-body">
              <div className="info-row">
                <InfoField
                  label="Madrassa Name"
                  value={previous.name || "None"}
                />
                <InfoField
                  label="Topic Studied"
                  value={previous.topic || "None"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Accordion */}
        <div className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleSection("bank")}
          >
            <span className="accordion-title">
              <i className="fas fa-university"></i> Bank Details (Optional)
            </span>
            <i
              className={`fas fa-chevron-${
                openSections.bank ? "up" : "down"
              } accordion-icon`}
            ></i>
          </button>
          <div
            className={`accordion-content ${openSections.bank ? "open" : ""}`}
          >
            <div className="accordion-body">
              <div className="info-row">
                <InfoField label="Bank Name" value={bank.bank_name || "None"} />
                <InfoField
                  label="Account Number"
                  value={bank.account_number || "None"}
                />
              </div>
              <div className="info-row">
                <InfoField
                  label="Account Title"
                  value={bank.account_title || "None"}
                />
                <InfoField label="Branch" value={bank.branch || "None"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value, fullWidth }) => {
  return (
    <div className={`info-field ${fullWidth ? "full-width" : ""}`}>
      <label className="info-label">{label}</label>
      <div className="info-value">{value || "-"}</div>
    </div>
  );
};

export default Profile;
