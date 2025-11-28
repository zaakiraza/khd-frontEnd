import React from "react";
import "./Courses.css";

const Courses = ({ userDetails }) => {
  //     fontSize: 12,
  //     border: "1px solid #e2e8f0",
  //   },
  // };

  const classes = userDetails?.class_history || [];

  const labelFrom = (entity, key) => {
    if (!entity) return "-";
    if (typeof entity === "string") return `${entity.slice(0, 6)}…`;
    if (entity && typeof entity === "object") {
      return entity[key] || entity.name || JSON.stringify(entity).slice(0, 12);
    }
    return "-";
  };

  return (
    <div className="courses-container">
      <div className="courses-section-header">
        <h2 className="courses-title">Registered Courses</h2>
        <span className="courses-small-text">{classes.length} total</span>
      </div>
      <table className="courses-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Class</th>
            <th>Year</th>
            <th>Session</th>
            <th>Status</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan={6}>
                No registered classes yet.
              </td>
            </tr>
          ) : (
            classes.map((c, idx) => (
              <tr key={`${c?._id || idx}`}>
                <td>{idx + 1}</td>
                <td>
                  {labelFrom(c?.class_name, "class_name")}
                </td>
                <td>{c?.year || "-"}</td>
                <td>
                  {labelFrom(c?.session, "session_name")}
                </td>
                <td>
                  <span className="status-tag">{c?.status || "-"}</span>
                </td>
                <td>{c?.result || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;