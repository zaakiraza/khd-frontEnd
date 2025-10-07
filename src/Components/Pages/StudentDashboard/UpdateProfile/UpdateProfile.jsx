import React from "react";
import "./UpdateProfile.css";

const UpdateProfile = ({ form, onChange, saveProfile, saving, userDetails, buildInitialForm, setForm }) => {
  const styles = {
    card: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    h2: { fontSize: 18, margin: 0 },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    small: { fontSize: 12, color: "#666" },
    btn: {
      padding: "8px 12px",
      borderRadius: 6,
      border: "1px solid #ddd",
      background: "#f7f7f7",
      cursor: "pointer",
    },
    primary: {
      background: "#293c5d",
      color: "white",
      border: "1px solid #293c5d",
    },
  };

  return (
    <form style={{ ...styles.card }} onSubmit={saveProfile}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Update Profile</h2>
        <div style={styles.small}>Please fill all required fields</div>
      </div>
      {form && (
        <>
          <Section title="Personal Info">
            <div style={styles.formGrid}>
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
            <div style={styles.formGrid}>
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
            <div style={styles.formGrid}>
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
            <div style={styles.small}>
              Note: Backend requires inProgress=false currently.
            </div>
          </Section>

          <Section title="Previous Madrassa">
            <div style={styles.formGrid}>
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
            <div style={styles.formGrid}>
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

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              type="submit"
              style={{ ...styles.btn, ...styles.primary }}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              style={styles.btn}
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
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
  };
  return (
    <label>
      <div style={{ color: "#444", fontSize: 12, marginBottom: 4 }}>
        {label}
      </div>
      <input
        style={inputStyle}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        type={type}
      />
    </label>
  );
}

function Select({ label, value, onChange, options = [] }) {
  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
  };
  return (
    <label>
      <div style={{ color: "#444", fontSize: 12, marginBottom: 4 }}>
        {label}
      </div>
      <select
        style={inputStyle}
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