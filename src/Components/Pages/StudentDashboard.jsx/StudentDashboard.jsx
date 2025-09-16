import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const BASEURL = import.meta.env.VITE_BASEURL;
  const token = localStorage.getItem("token");

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile | courses | attendance | quizzes | update

  const THEME = "#7a782b";

  const headers = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const fetchUser = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASEURL}/users/single`, headers);
      const data = res?.data?.data || null;
      setUserDetails(data);
      setForm(buildInitialForm(data));
    } catch (e) {
      setError(
        e?.response?.data?.message || e?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildInitialForm(user) {
    const pi = user?.personal_info || {};
    const gi = user?.guardian_info || {};
    const ap = user?.academic_progress || {};
    const bm = user?.bank_info || {};
    const pm = user?.previous_madrassa || {};
    return {
      personal_info: {
        first_name: pi.first_name || "",
        last_name: pi.last_name || "",
        father_name: pi.father_name || "",
        gender: pi.gender || "Male",
        whatsapp_no: pi.whatsapp_no || "",
        alternative_no: pi.alternative_no || "",
        dob: formatDateInput(pi.dob),
        age: pi.age ?? "",
        address: pi.address || "",
        city: pi.city || "",
        country: pi.country || "",
        img_URL: pi.img_URL || "",
        doc_img: pi.doc_img || "",
        marj_e_taqleed: pi.marj_e_taqleed || "",
      },
      guardian_info: {
        name: gi.name || "",
        relationship: gi.relationship || "",
        email: gi.email || "",
        whatsapp_no: gi.whatsapp_no || "",
        address: gi.address || "",
        CNIC: gi.CNIC || "",
      },
      academic_progress: {
        academic_class: ap.academic_class ?? "",
        institute_name: ap.institute_name || "",
        inProgress: false,
        result: ap.result || "",
      },
      previous_madrassa: {
        name: pm.name || "",
        topic: pm.topic || "",
      },
      bank_info: {
        bank_name: bm.bank_name || "",
        account_number: bm.account_number || "",
        account_title: bm.account_title || "",
        branch: bm.branch || "",
      },
    };
  }

  function formatDateInput(d) {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const onChange = (path, value) => {
    setForm((prev) => setByPath(prev, path, value));
  };

  function setByPath(obj, path, value) {
    const keys = path.split(".");
    const next = { ...obj };
    let cur = next;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      cur[k] = { ...cur[k] };
      cur = cur[k];
    }
    cur[keys[keys.length - 1]] = value;
    return next;
  }

  const saveProfile = async (e) => {
    e?.preventDefault?.();
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      const res = await axios.put(
        `${BASEURL}/users/update_personal`,
        payload,
        headers
      );
      const updated = res?.data?.data;
      const merged = {
        ...userDetails,
        personal_info: updated?.personal_info || userDetails?.personal_info,
        guardian_info: updated?.guardian_info || userDetails?.guardian_info,
        academic_progress:
          updated?.academic_progress || userDetails?.academic_progress,
        previous_madrassa:
          updated?.previous_madrassa || userDetails?.previous_madrassa,
        bank_info: updated?.bank_info || userDetails?.bank_info,
      };
      setUserDetails(merged);
      setEditing(false);
    } catch (e) {
      setError(
        e?.response?.data?.message || e?.message || "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const safeName = (u) => {
    const pi = u?.personal_info || {};
    const fn = pi.first_name || "";
    const ln = pi.last_name || "";
    return `${fn} ${ln}`.trim() || "Student";
  };

  const safeImg = (u) => u?.personal_info?.img_URL || "/logo.png";

  const classes = userDetails?.class_history || [];

  const calcAttendance = (item, idx) => {
    const base = item?.status === "completed" ? 88 : 72;
    const bump = ((idx + 1) * 7) % 9; // small variation
    return Math.min(100, base + bump);
  };

  const calcQuizMarks = (item, idx) => {
    const base = item?.status === "completed" ? 85 : 70;
    const q1 = Math.min(100, base + ((idx + 1) * 3) % 10);
    const q2 = Math.min(100, base + ((idx + 2) * 5) % 12);
    const q3 = Math.min(100, base + ((idx + 3) * 4) % 8);
    return [q1, q2, q3];
  };

  const labelFrom = (entity, key) => {
    if (!entity) return "-";
    if (typeof entity === "string") return `${entity.slice(0, 6)}…`;
    if (entity && typeof entity === "object") {
      return entity[key] || entity.name || JSON.stringify(entity).slice(0, 12);
    }
    return "-";
  };

  const styles = {
    page: { padding: 16, maxWidth: 1200, margin: "0 auto" },
    layout: { display: "grid", gridTemplateColumns: "240px 1fr", gap: 16, alignItems: "start" },
    sidebar: { background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
    navItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      padding: "10px 12px",
      marginBottom: 6,
      borderRadius: 8,
      border: `1px solid ${active ? THEME : "#eee"}`,
      background: active ? THEME : "#f9fafb",
      color: active ? "#fff" : "#111",
      cursor: "pointer",
    }),
    content: {},
    card: { background: "#fff", border: "1px solid #eee", borderRadius: 8, padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
    sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    h2: { fontSize: 18, margin: 0 },
    avatarRow: { display: "flex", gap: 12, alignItems: "center" },
    avatar: { width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "1px solid #eee" },
    table: { width: "100%", borderCollapse: "collapse" },
    thtd: { borderBottom: "1px solid #eee", padding: "8px 6px", textAlign: "left", fontSize: 13 },
    btn: { padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd", background: "#f7f7f7", cursor: "pointer" },
    primary: { background: THEME, color: "white", border: `1px solid ${THEME}` },
    danger: { background: "#ef4444", color: "white", border: "1px solid #b91c1c" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    small: { fontSize: 12, color: "#666" },
    tag: { padding: "2px 8px", background: "#f1f5f9", borderRadius: 999, fontSize: 12, border: "1px solid #e2e8f0" },
  };

  const renderProfile = () => (
    <div style={{ ...styles.card }}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Profile</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div>
          <div style={styles.avatarRow}>
            <img src={safeImg(userDetails)} alt="avatar" style={styles.avatar} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{safeName(userDetails)}</div>
              <div style={styles.small}>Roll No: {userDetails?.personal_info?.rollNo ?? "-"}</div>
              <div style={styles.small}>Status: <span style={styles.tag}>{userDetails?.personal_info?.status ?? "active"}</span></div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Info label="Phone" value={userDetails?.personal_info?.whatsapp_no} />
            <Info label="Alt. Phone" value={userDetails?.personal_info?.alternative_no || "-"} />
            <Info label="Gender" value={userDetails?.personal_info?.gender} />
            <Info label="Age" value={userDetails?.personal_info?.age} />
            <Info label="City" value={userDetails?.personal_info?.city} />
            <Info label="Country" value={userDetails?.personal_info?.country} />
            <Info label="Address" value={userDetails?.personal_info?.address} full />
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Academic Progress</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Info label="Class" value={userDetails?.academic_progress?.academic_class} />
            <Info label="Institute" value={userDetails?.academic_progress?.institute_name} />
            <Info label="Result" value={userDetails?.academic_progress?.result || "-"} />
          </div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>Guardian</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Info label="Name" value={userDetails?.guardian_info?.name} />
            <Info label="Relationship" value={userDetails?.guardian_info?.relationship} />
            <Info label="Contact" value={userDetails?.guardian_info?.whatsapp_no} />
            <Info label="CNIC" value={userDetails?.guardian_info?.CNIC} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div style={{ ...styles.card }}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Registered Courses</h2>
        <span style={styles.small}>{classes.length} total</span>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>#</th>
            <th style={styles.thtd}>Class</th>
            <th style={styles.thtd}>Year</th>
            <th style={styles.thtd}>Session</th>
            <th style={styles.thtd}>Status</th>
            <th style={styles.thtd}>Result</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td style={styles.thtd} colSpan={6}>No registered classes yet.</td>
            </tr>
          ) : (
            classes.map((c, idx) => (
              <tr key={`${c?._id || idx}`}>
                <td style={styles.thtd}>{idx + 1}</td>
                <td style={styles.thtd}>{labelFrom(c?.class_name, "class_name")}</td>
                <td style={styles.thtd}>{c?.year || "-"}</td>
                <td style={styles.thtd}>{labelFrom(c?.session, "session_name")}</td>
                <td style={styles.thtd}><span style={styles.tag}>{c?.status || "-"}</span></td>
                <td style={styles.thtd}>{c?.result || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderAttendance = () => (
    <div style={{ ...styles.card }}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Attendance</h2>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>Course</th>
            <th style={styles.thtd}>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td style={styles.thtd} colSpan={2}>No data</td>
            </tr>
          ) : (
            classes.map((c, idx) => (
              <tr key={`att-${c?._id || idx}`}>
                <td style={styles.thtd}>{labelFrom(c?.class_name, "class_name")}</td>
                <td style={styles.thtd}>{calcAttendance(c, idx)}%</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={styles.small}>Note: Placeholder values until backend attendance API is available.</div>
    </div>
  );

  const renderQuizzes = () => (
    <div style={{ ...styles.card }}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Quiz Marks</h2>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thtd}>Course</th>
            <th style={styles.thtd}>Quiz 1</th>
            <th style={styles.thtd}>Quiz 2</th>
            <th style={styles.thtd}>Quiz 3</th>
            <th style={styles.thtd}>Average</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td style={styles.thtd} colSpan={5}>No data</td>
            </tr>
          ) : (
            classes.map((c, idx) => {
              const [q1, q2, q3] = calcQuizMarks(c, idx);
              const avg = Math.round((q1 + q2 + q3) / 3);
              return (
                <tr key={`quiz-${c?._id || idx}`}>
                  <td style={styles.thtd}>{labelFrom(c?.class_name, "class_name")}</td>
                  <td style={styles.thtd}>{q1}</td>
                  <td style={styles.thtd}>{q2}</td>
                  <td style={styles.thtd}>{q3}</td>
                  <td style={styles.thtd}>{avg}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div style={styles.small}>Note: Placeholder values until backend quizzes API is available.</div>
    </div>
  );

  const renderUpdate = () => (
    <form style={{ ...styles.card }} onSubmit={saveProfile}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Update Profile</h2>
        <div style={styles.small}>Please fill all required fields</div>
      </div>
      {form && (
        <>
          <Section title="Personal Info">
            <div style={styles.formGrid}>
              <Field label="First Name" value={form.personal_info.first_name} onChange={(v) => onChange("personal_info.first_name", v)} />
              <Field label="Last Name" value={form.personal_info.last_name} onChange={(v) => onChange("personal_info.last_name", v)} />
              <Field label="Father Name" value={form.personal_info.father_name} onChange={(v) => onChange("personal_info.father_name", v)} />
              <Select label="Gender" value={form.personal_info.gender} onChange={(v) => onChange("personal_info.gender", v)} options={["Male", "Female", "Other"]} />
              <Field label="WhatsApp No" value={form.personal_info.whatsapp_no} onChange={(v) => onChange("personal_info.whatsapp_no", v)} />
              <Field label="Alternative No" value={form.personal_info.alternative_no} onChange={(v) => onChange("personal_info.alternative_no", v)} />
              <Field type="date" label="Date of Birth" value={form.personal_info.dob} onChange={(v) => onChange("personal_info.dob", v)} />
              <Field type="number" label="Age" value={form.personal_info.age} onChange={(v) => onChange("personal_info.age", Number(v))} />
              <Field label="Address" value={form.personal_info.address} onChange={(v) => onChange("personal_info.address", v)} />
              <Field label="City" value={form.personal_info.city} onChange={(v) => onChange("personal_info.city", v)} />
              <Field label="Country" value={form.personal_info.country} onChange={(v) => onChange("personal_info.country", v)} />
              <Field label="Profile Image URL" value={form.personal_info.img_URL} onChange={(v) => onChange("personal_info.img_URL", v)} />
              <Field label="Document Image URL" value={form.personal_info.doc_img} onChange={(v) => onChange("personal_info.doc_img", v)} />
              <Field label="Marj-e-Taqleed" value={form.personal_info.marj_e_taqleed} onChange={(v) => onChange("personal_info.marj_e_taqleed", v)} />
            </div>
          </Section>

          <Section title="Guardian Info">
            <div style={styles.formGrid}>
              <Field label="Name" value={form.guardian_info.name} onChange={(v) => onChange("guardian_info.name", v)} />
              <Field label="Relationship" value={form.guardian_info.relationship} onChange={(v) => onChange("guardian_info.relationship", v)} />
              <Field label="Email" value={form.guardian_info.email} onChange={(v) => onChange("guardian_info.email", v)} />
              <Field label="WhatsApp No" value={form.guardian_info.whatsapp_no} onChange={(v) => onChange("guardian_info.whatsapp_no", v)} />
              <Field label="Address" value={form.guardian_info.address} onChange={(v) => onChange("guardian_info.address", v)} />
              <Field label="CNIC" value={form.guardian_info.CNIC} onChange={(v) => onChange("guardian_info.CNIC", v)} />
            </div>
          </Section>

          <Section title="Academic Progress">
            <div style={styles.formGrid}>
              <Field type="number" label="Academic Class" value={form.academic_progress.academic_class} onChange={(v) => onChange("academic_progress.academic_class", Number(v))} />
              <Field label="Institute Name" value={form.academic_progress.institute_name} onChange={(v) => onChange("academic_progress.institute_name", v)} />
              <Select label="In Progress" value={String(form.academic_progress.inProgress)} onChange={(v) => onChange("academic_progress.inProgress", v === "true")} options={["false", "true"]} />
              <Field label="Result" value={form.academic_progress.result} onChange={(v) => onChange("academic_progress.result", v)} />
            </div>
            <div style={styles.small}>Note: Backend requires inProgress=false currently.</div>
          </Section>

          <Section title="Previous Madrassa">
            <div style={styles.formGrid}>
              <Field label="Name" value={form.previous_madrassa.name} onChange={(v) => onChange("previous_madrassa.name", v)} />
              <Field label="Topic" value={form.previous_madrassa.topic} onChange={(v) => onChange("previous_madrassa.topic", v)} />
            </div>
          </Section>

          <Section title="Bank Info">
            <div style={styles.formGrid}>
              <Field label="Bank Name" value={form.bank_info.bank_name} onChange={(v) => onChange("bank_info.bank_name", v)} />
              <Field label="Account Number" value={form.bank_info.account_number} onChange={(v) => onChange("bank_info.account_number", v)} />
              <Field label="Account Title" value={form.bank_info.account_title} onChange={(v) => onChange("bank_info.account_title", v)} />
              <Field label="Branch" value={form.bank_info.branch} onChange={(v) => onChange("bank_info.branch", v)} />
            </div>
          </Section>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="submit" style={{ ...styles.btn, ...styles.primary }} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button type="button" style={styles.btn} onClick={() => setForm(buildInitialForm(userDetails))} disabled={saving}>
              Reset
            </button>
          </div>
        </>
      )}
    </form>
  );

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>
          <button style={{ ...styles.btn, ...styles.primary }} onClick={fetchUser}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={{ fontWeight: 700, margin: "2px 4px 8px", color: THEME }}>Student Dashboard</div>
          <button style={styles.navItem(activeTab === "profile")} onClick={() => setActiveTab("profile")}>Profile</button>
          <button style={styles.navItem(activeTab === "courses")} onClick={() => setActiveTab("courses")}>Courses</button>
          <button style={styles.navItem(activeTab === "attendance")} onClick={() => setActiveTab("attendance")}>Attendance</button>
          <button style={styles.navItem(activeTab === "quizzes")} onClick={() => setActiveTab("quizzes")}>Quizzes</button>
          <button style={styles.navItem(activeTab === "update")} onClick={() => setActiveTab("update")}>Update Profile</button>
        </aside>
        <main style={styles.content}>
          {activeTab === "profile" && renderProfile()}
          {activeTab === "courses" && renderCourses()}
          {activeTab === "attendance" && renderAttendance()}
          {activeTab === "quizzes" && renderQuizzes()}
          {activeTab === "update" && renderUpdate()}
        </main>
      </div>
    </div>
  );
}

function Info({ label, value, full }) {
  const styles = {
    wrap: { display: full ? "block" : "grid", gridTemplateColumns: full ? undefined : "1fr", gap: 2 },
    label: { color: "#666", fontSize: 12 },
    value: { fontSize: 14 },
  };
  return (
    <div style={styles.wrap}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value ?? "-"}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd" };
  return (
    <label>
      <div style={{ color: "#444", fontSize: 12, marginBottom: 4 }}>{label}</div>
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
  const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd" };
  return (
    <label>
      <div style={{ color: "#444", fontSize: 12, marginBottom: 4 }}>{label}</div>
      <select style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default StudentDashboard;