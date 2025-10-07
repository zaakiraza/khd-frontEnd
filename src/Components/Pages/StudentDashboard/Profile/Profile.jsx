import React from "react";
import "./Profile.css";

const Profile = ({ userDetails }) => {
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
    avatarRow: { display: "flex", gap: 12, alignItems: "center" },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: "50%",
      objectFit: "cover",
      border: "1px solid #eee",
    },
    small: { fontSize: 12, color: "#666" },
    tag: {
      padding: "2px 8px",
      background: "#f1f5f9",
      borderRadius: 999,
      fontSize: 12,
      border: "1px solid #e2e8f0",
    },
  };

  const safeName = (u) => {
    const pi = u?.personal_info || {};
    const fn = pi.first_name || "";
    const ln = pi.last_name || "";
    return `${fn} ${ln}`.trim() || "Student";
  };

  const safeImg = (u) => u?.personal_info?.img_URL || "/logo.png";

  return (
    <div style={{ ...styles.card }}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>Profile</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div>
          <div style={styles.avatarRow}>
            <img
              src={safeImg(userDetails)}
              alt="avatar"
              style={styles.avatar}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {safeName(userDetails)}
              </div>
              <div style={styles.small}>
                Roll No: {userDetails?.personal_info?.rollNo ?? "-"}
              </div>
              <div style={styles.small}>
                Status:{" "}
                <span style={styles.tag}>
                  {userDetails?.personal_info?.status ?? "active"}
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            <Info
              label="Phone"
              value={userDetails?.personal_info?.whatsapp_no}
            />
            <Info
              label="Alt. Phone"
              value={userDetails?.personal_info?.alternative_no || "-"}
            />
            <Info label="Gender" value={userDetails?.personal_info?.gender} />
            <Info label="Age" value={userDetails?.personal_info?.age} />
            <Info label="City" value={userDetails?.personal_info?.city} />
            <Info label="Country" value={userDetails?.personal_info?.country} />
            <Info
              label="Address"
              value={userDetails?.personal_info?.address}
              full
            />
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>
            Academic Progress
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <Info
              label="Class"
              value={userDetails?.academic_progress?.academic_class}
            />
            <Info
              label="Institute"
              value={userDetails?.academic_progress?.institute_name}
            />
            <Info
              label="Result"
              value={userDetails?.academic_progress?.result || "-"}
            />
          </div>
          <div style={{ marginTop: 12, fontWeight: 600 }}>Guardian</div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <Info label="Name" value={userDetails?.guardian_info?.name} />
            <Info
              label="Relationship"
              value={userDetails?.guardian_info?.relationship}
            />
            <Info
              label="Contact"
              value={userDetails?.guardian_info?.whatsapp_no}
            />
            <Info label="CNIC" value={userDetails?.guardian_info?.CNIC} />
          </div>
        </div>
      </div>
    </div>
  );
};

function Info({ label, value, full }) {
  const styles = {
    wrap: {
      display: full ? "block" : "grid",
      gridTemplateColumns: full ? undefined : "1fr",
      gap: 2,
    },
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

export default Profile;