import React from "react";
import "./UpdateProfile.css";

const UpdateProfile = ({ form, onChange, saveProfile, saving, userDetails, buildInitialForm, setForm }) => {

  return (
    <form className="update-profile-card" onSubmit={saveProfile}>
      <div className="update-profile-header">
        <h2 className="update-profile-title">Update Profile</h2>
        <div className="update-profile-subtitle">Please fill all required fields</div>
      </div>
      {form && (
        <>
          <Section title="Personal Info">
            <div className="update-profile-form-grid">
              <Field
                label="First Name"
                value={form.personal_info.first_name}
                onChange={(v) => onChange("personal_info.first_name", v)}
              />
              <Field
                label="Last Name"
                value={form.personal_info.last_name}
                onChange={(v) => onChange("personal_info.last_name", v)}
              />
              <Field
                label="Father Name"
                value={form.personal_info.father_name}
                onChange={(v) => onChange("personal_info.father_name", v)}
              />
              <Select
                label="Gender"
                value={form.personal_info.gender}
                onChange={(v) => onChange("personal_info.gender", v)}
                options={["Male", "Female", "Other"]}
              />
              <Field
                label="WhatsApp No"
                value={form.personal_info.whatsapp_no}
                onChange={(v) => onChange("personal_info.whatsapp_no", v)}
              />
              <Field
                label="Alternative No"
                value={form.personal_info.alternative_no}
                onChange={(v) => onChange("personal_info.alternative_no", v)}
              />
              <Field
                type="date"
                label="Date of Birth"
                value={form.personal_info.dob}
                onChange={(v) => onChange("personal_info.dob", v)}
              />
              <Field
                type="number"
                label="Age"
                value={form.personal_info.age}
                onChange={(v) => onChange("personal_info.age", Number(v))}
              />
              <Field
                label="Address"
                value={form.personal_info.address}
                onChange={(v) => onChange("personal_info.address", v)}
              />
              <Field
                label="City"
                value={form.personal_info.city}
                onChange={(v) => onChange("personal_info.city", v)}
              />
              <Field
                label="Country"
                value={form.personal_info.country}
                onChange={(v) => onChange("personal_info.country", v)}
              />
              <Field
                label="Profile Image URL"
                value={form.personal_info.img_URL}
                onChange={(v) => onChange("personal_info.img_URL", v)}
              />
              <Field
                label="Document Image URL"
                value={form.personal_info.doc_img}
                onChange={(v) => onChange("personal_info.doc_img", v)}
              />
              <Field
                label="Marj-e-Taqleed"
                value={form.personal_info.marj_e_taqleed}
                onChange={(v) => onChange("personal_info.marj_e_taqleed", v)}
              />
            </div>
          </Section>

          <Section title="Guardian Info">
            <div className="update-profile-form-grid">
              <Field
                label="Name"
                value={form.guardian_info.name}
                onChange={(v) => onChange("guardian_info.name", v)}
              />
              <Field
                label="Relationship"
                value={form.guardian_info.relationship}
                onChange={(v) => onChange("guardian_info.relationship", v)}
              />
              <Field
                label="Email"
                value={form.guardian_info.email}
                onChange={(v) => onChange("guardian_info.email", v)}
              />
              <Field
                label="WhatsApp No"
                value={form.guardian_info.whatsapp_no}
                onChange={(v) => onChange("guardian_info.whatsapp_no", v)}
              />
              <Field
                label="Address"
                value={form.guardian_info.address}
                onChange={(v) => onChange("guardian_info.address", v)}
              />
              <Field
                label="CNIC"
                value={form.guardian_info.CNIC}
                onChange={(v) => onChange("guardian_info.CNIC", v)}
              />
            </div>
          </Section>

          <Section title="Academic Progress">
            <div className="update-profile-form-grid">
              <Field
                type="number"
                label="Academic Class"
                value={form.academic_progress.academic_class}
                onChange={(v) =>
                  onChange("academic_progress.academic_class", Number(v))
                }
              />
              <Field
                label="Institute Name"
                value={form.academic_progress.institute_name}
                onChange={(v) =>
                  onChange("academic_progress.institute_name", v)
                }
              />
              <Select
                label="In Progress"
                value={String(form.academic_progress.inProgress)}
                onChange={(v) =>
                  onChange("academic_progress.inProgress", v === "true")
                }
                options={["false", "true"]}
              />
              <Field
                label="Result"
                value={form.academic_progress.result}
                onChange={(v) => onChange("academic_progress.result", v)}
              />
            </div>
            <div className="update-profile-note">
              Note: Backend requires inProgress=false currently.
            </div>
          </Section>

          <Section title="Previous Madrassa">
            <div className="update-profile-form-grid">
              <Field
                label="Name"
                value={form.previous_madrassa.name}
                onChange={(v) => onChange("previous_madrassa.name", v)}
              />
              <Field
                label="Topic"
                value={form.previous_madrassa.topic}
                onChange={(v) => onChange("previous_madrassa.topic", v)}
              />
            </div>
          </Section>

          <Section title="Bank Info">
            <div className="update-profile-form-grid">
              <Field
                label="Bank Name"
                value={form.bank_info.bank_name}
                onChange={(v) => onChange("bank_info.bank_name", v)}
              />
              <Field
                label="Account Number"
                value={form.bank_info.account_number}
                onChange={(v) => onChange("bank_info.account_number", v)}
              />
              <Field
                label="Account Title"
                value={form.bank_info.account_title}
                onChange={(v) => onChange("bank_info.account_title", v)}
              />
              <Field
                label="Branch"
                value={form.bank_info.branch}
                onChange={(v) => onChange("bank_info.branch", v)}
              />
            </div>
          </Section>

          <div className="update-profile-buttons">
            <button
              type="submit"
              className="update-profile-btn update-profile-btn-primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              className="update-profile-btn"
              onClick={() => setForm(buildInitialForm(userDetails))}
              disabled={saving}
            >
              Reset
            </button>
          </div>
        </>
      )}
    </form>
  );
};

function Section({ title, children }) {
  return (
    <div className="update-profile-section">
      <div className="update-profile-section-title">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="update-profile-field">
      <div className="update-profile-field-label">
        {label}
      </div>
      <input
        className="update-profile-input"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        type={type}
      />
    </label>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <label className="update-profile-field">
      <div className="update-profile-field-label">
        {label}
      </div>
      <select
        className="update-profile-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default UpdateProfile;