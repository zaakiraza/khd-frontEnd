import React, { useState, useEffect } from "react";
import { useToast } from "../../../Common/Toast/ToastContext";
import api from "../../../../utils/api";
import "./LessonPlans.css";

const LessonPlans = ({ userDetails }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      
      // Try to get lesson plans for user's class
      const classHistory = userDetails?.class_history || [];
      const currentClass = classHistory.find(ch => ch.status === "active");
      
      let url = "/lesson-plan?status=published";
      if (currentClass?.class_name?._id) {
        url = `/lesson-plan?class_id=${currentClass.class_name._id}&status=published`;
      }
      
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setLessonPlans(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lesson plans:", error);
      toast.showError("Failed to fetch lesson plans");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lesson-plans-card">
        <div className="lesson-plans-loading">
          <i className="fas fa-spinner fa-spin"></i> Loading lesson plans...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="lesson-plans-card">
        <div className="lesson-plans-header">
          <h2 className="lesson-plans-title">
            <i className="fas fa-book"></i> Lesson Plans
          </h2>
        </div>

        {lessonPlans.length === 0 ? (
          <div className="lesson-plans-empty">
            <i className="fas fa-folder-open"></i>
            <p>No lesson plans available</p>
          </div>
        ) : (
          lessonPlans.map((plan) => (
            <div
              key={plan._id}
              className="lesson-plan-card"
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="lesson-plan-header">
                <div className="lesson-plan-title">{plan.title}</div>
                <div className="lesson-plan-date">
                  {new Date(plan.date).toLocaleDateString()}
                </div>
              </div>

              <div className="lesson-plan-meta">
                <span>
                  <i className="fas fa-book"></i> {plan.subject}
                </span>
                <span>
                  <i className="fas fa-calendar-week"></i> Week {plan.week_number}, {plan.year}
                </span>
                <span>
                  <i className="fas fa-chalkboard"></i> {plan.class_name}
                </span>
              </div>

              {plan.description && (
                <div className="lesson-plan-description">{plan.description}</div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedPlan && (
        <div className="lesson-plans-modal" onClick={() => setSelectedPlan(null)}>
          <div className="lesson-plans-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="lesson-plans-modal-header">
              <h2>{selectedPlan.title}</h2>
              <button 
                className="lesson-plans-close-btn" 
                onClick={() => setSelectedPlan(null)}
              >
                ×
              </button>
            </div>

            <div className="lesson-plans-modal-section">
              <div className="lesson-plan-meta">
                <span>
                  <i className="fas fa-book"></i> {selectedPlan.subject}
                </span>
                <span>
                  <i className="fas fa-calendar-week"></i> Week {selectedPlan.week_number}, {selectedPlan.year}
                </span>
              </div>
            </div>

            <div className="lesson-plans-modal-section">
              <h3>Description:</h3>
              <p>{selectedPlan.description}</p>
            </div>

            <div className="lesson-plans-modal-section">
              <h3>Content:</h3>
              <div
                className="lesson-plans-content"
                dangerouslySetInnerHTML={{ __html: selectedPlan.content }}
              />
            </div>

            {selectedPlan.attachments && selectedPlan.attachments.length > 0 && (
              <div className="lesson-plans-modal-section">
                <h3>Attachments:</h3>
                <div className="lesson-plans-attachments">
                  {selectedPlan.attachments.map((att, idx) => (
                    <div key={idx} className="lesson-plans-attachment">
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-file"></i> {att.filename}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LessonPlans;