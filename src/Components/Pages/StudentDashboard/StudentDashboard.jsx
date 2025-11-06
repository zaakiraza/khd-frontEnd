import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "../../Common/Toast/ToastContext";
import Sidebar from "./Sidebar/Sidebar";
import Profile from "./Profile/Profile";
import Courses from "./Courses/Courses";
import Attendance from "./Attendance/Attendance";
import Quizzes from "./Quizzes/Quizzes";
import UpdateProfile from "./UpdateProfile/UpdateProfile";

function StudentDashboard() {
  const toast = useToast();
  const BASEURL = import.meta.env.VITE_BASEURL;
  const token = localStorage.getItem("token");

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const THEME = "#293c5d";

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
      toast.showSuccess("Profile loaded successfully!");
    } catch (e) {
      const errorMsg = e?.response?.data?.message || e?.message || "Failed to load profile";
      setError(errorMsg);
      toast.showError(errorMsg);
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
      toast.showSuccess("Profile updated successfully!");
    } catch (e) {
      const errorMsg = e?.response?.data?.message || e?.message || "Failed to save profile";
      setError(errorMsg);
      toast.showError(errorMsg);
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

  const styles = {
    page: { padding: 16, maxWidth: 1200, margin: "0 auto" },
    layout: {
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      gap: 16,
      alignItems: "start",
    },
    content: {},
    card: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 8,
      padding: 16,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    btn: {
      padding: "8px 12px",
      borderRadius: 6,
      border: "1px solid #ddd",
      background: "#f7f7f7",
      cursor: "pointer",
    },
    primary: {
      background: THEME,
      color: "white",
      border: `1px solid ${THEME}`,
    },
  };

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
          <button
            style={{ ...styles.btn, ...styles.primary }}
            onClick={fetchUser}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} THEME={THEME} />
        <main style={styles.content}>
          {activeTab === "profile" && <Profile userDetails={userDetails} />}
          {activeTab === "courses" && <Courses userDetails={userDetails} />}
          {activeTab === "attendance" && <Attendance userDetails={userDetails} />}
          {activeTab === "quizzes" && <Quizzes userDetails={userDetails} />}
          {activeTab === "update" && (
            <UpdateProfile
              form={form}
              onChange={onChange}
              saveProfile={saveProfile}
              saving={saving}
              userDetails={userDetails}
              buildInitialForm={buildInitialForm}
              setForm={setForm}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
