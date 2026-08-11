import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import apiClient from "../utils/apiClient";

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null); // null = Add, Object = Edit
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingExperience, setDeletingExperience] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    description: "",
    technologies: "",
    is_current_job: false,
    sort_order: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const showToastNotification = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/admin/experience");
      if (res.data && res.data.status) {
        setExperiences(res.data.data || []);
      } else {
        setExperiences(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
      setError("Failed to load work experience. Please check your network connection or server.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingExperience(null);
    setFormData({
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      technologies: "",
      is_current_job: false,
      sort_order: experiences.length + 1,
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (exp) => {
    setEditingExperience(exp);
    let techString = "";
    if (Array.isArray(exp.technologies)) {
      techString = exp.technologies.join(", ");
    } else if (typeof exp.technologies === "string") {
      techString = exp.technologies;
    }

    setFormData({
      company: exp.company || "",
      position: exp.position || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      description: exp.description || "",
      technologies: techString,
      is_current_job: Boolean(exp.is_current_job),
      sort_order: exp.sort_order ?? 0,
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const openDeleteModal = (exp) => {
    setDeletingExperience(exp);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "is_current_job" && checked) {
        updated.end_date = "";
      }
      return updated;
    });
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitting(true);

    try {
      const payload = {
        company: formData.company,
        position: formData.position,
        start_date: formData.start_date,
        end_date: formData.is_current_job ? null : formData.end_date,
        description: formData.description,
        technologies: formData.technologies,
        is_current_job: formData.is_current_job,
        sort_order: parseInt(formData.sort_order, 10) || 0,
      };

      if (editingExperience) {
        await apiClient.put(`/api/admin/experience/${editingExperience.id}`, payload);
        showToastNotification("success", "Work experience updated successfully!");
      } else {
        await apiClient.post("/api/admin/experience", payload);
        showToastNotification("success", "Work experience added successfully!");
      }

      setShowFormModal(false);
      fetchExperiences();
    } catch (err) {
      console.error("Save experience error:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        showToastNotification("error", err.response?.data?.message || "Failed to save experience.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExperience) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/experience/${deletingExperience.id}`);
      showToastNotification("success", "Work experience deleted successfully!");
      setShowDeleteModal(false);
      setDeletingExperience(null);
      fetchExperiences();
    } catch (err) {
      console.error("Delete experience error:", err);
      showToastNotification("error", "Failed to delete experience.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter experiences
  const filteredExperiences = experiences.filter((exp) => {
    const term = searchTerm.toLowerCase();
    const matchesCompany = exp.company.toLowerCase().includes(term);
    const matchesPosition = exp.position.toLowerCase().includes(term);
    const matchesDescription = exp.description && exp.description.toLowerCase().includes(term);
    const matchesTech = Array.isArray(exp.technologies)
      ? exp.technologies.join(" ").toLowerCase().includes(term)
      : String(exp.technologies || "").toLowerCase().includes(term);

    return matchesCompany || matchesPosition || matchesDescription || matchesTech;
  });

  const currentCount = experiences.filter((e) => e.is_current_job).length;
  const pastCount = experiences.length - currentCount;

  return (
    <AdminLayout title="Experience Management">
      <style>{`
        /* Header bar */
        .exp-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .stats-summary {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .stat-badge {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 10px 18px;
          border-radius: 14px;
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-badge strong {
          color: var(--text-main);
          margin-left: 6px;
          font-weight: 800;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
          transition: all 0.25s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(16, 185, 129, 0.5);
        }

        /* Controls bar */
        .controls-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 18px 22px;
          margin-bottom: 28px;
          display: flex;
          gap: 18px;
          align-items: center;
          backdrop-filter: blur(12px);
          box-shadow: var(--shadow-card);
        }

        .search-wrapper {
          flex: 1;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 18px 12px 42px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 12px;
          color: var(--text-main);
          font-size: 0.92rem;
          outline: none;
          transition: all 0.25s ease;
        }

        .search-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 1rem;
        }

        /* Timeline / Cards List */
        .exp-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .exp-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.25s ease;
          position: relative;
          box-shadow: var(--shadow-card);
        }

        .exp-card:hover {
          border-color: rgba(16, 185, 129, 0.35);
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .exp-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }

        .exp-role {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 4px 0;
        }

        .exp-company {
          font-size: 1rem;
          font-weight: 600;
          color: #10b981;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .exp-dates-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .date-badge {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          font-size: 0.82rem;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 500;
        }

        .current-badge {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #10b981;
          font-size: 0.78rem;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 700;
        }

        .exp-description {
          color: var(--text-muted);
          font-size: 0.92rem;
          line-height: 1.6;
          margin-bottom: 16px;
          white-space: pre-wrap;
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .tech-tag {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-size: 0.78rem;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .exp-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }

        .sort-order-text {
          font-size: 0.8rem;
          color: var(--text-dim);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          border: none;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-edit {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .btn-edit:hover {
          background: rgba(16, 185, 129, 0.3);
          color: #ffffff;
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #ffffff;
        }

        /* Empty State */
        .empty-state {
          background: rgba(13, 17, 38, 0.8);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 60px 20px;
          text-align: center;
          color: #b8bee6;
        }

        .empty-icon {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #ffffff;
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        /* Modal Overlay & Card */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 7, 18, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          background: var(--modal-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          width: 100%;
          max-width: 620px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
          animation: modalFade 0.25s ease-out;
        }

        @keyframes modalFade {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.4rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .close-btn:hover {
          color: var(--text-main);
          background: rgba(16, 185, 129, 0.1);
        }

        .modal-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 12px;
          color: var(--text-main);
          font-size: 0.95rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        .form-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .form-error {
          color: #f87171;
          font-size: 0.8rem;
          margin-top: 6px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
          font-size: 0.92rem;
          color: #ffffff;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: #10b981;
          cursor: pointer;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #b8bee6;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        /* Toast Notification */
        .toast-banner {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 14px 22px;
          border-radius: 14px;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.92rem;
          z-index: 2000;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          gap: 10px;
          animation: toastSlide 0.3s ease;
        }

        @keyframes toastSlide {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .toast-success {
          background: #059669;
          border: 1px solid #10b981;
        }

        .toast-error {
          background: #dc2626;
          border: 1px solid #ef4444;
        }
      `}</style>

      {/* Header bar */}
      <div className="exp-header-bar">
        <div className="stats-summary">
          <div className="stat-badge">
            Total Records: <strong>{experiences.length}</strong>
          </div>
          <div className="stat-badge">
            Current Roles: <strong>{currentCount}</strong>
          </div>
          <div className="stat-badge">
            Past Roles: <strong>{pastCount}</strong>
          </div>
        </div>

        <button className="btn-primary" onClick={openAddModal}>
          <span>➕</span> Add Experience
        </button>
      </div>

      {/* Controls Bar: Search */}
      <div className="controls-card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search experience by company, position, or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading work experience...</h3>
          <p>Connecting to backend API...</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: "#fca5a5" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn-primary" style={{ margin: "16px auto 0 auto" }} onClick={fetchExperiences}>
            🔄 Retry
          </button>
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h3>No Work Experience Found</h3>
          <p>
            {searchTerm
              ? "No experience records match your search filter."
              : "No work experience records added yet. Click 'Add Experience' to get started!"}
          </p>
        </div>
      ) : (
        /* Experience List Cards */
        <div className="exp-list">
          {filteredExperiences.map((exp) => {
            const techs = Array.isArray(exp.technologies)
              ? exp.technologies
              : typeof exp.technologies === "string"
              ? exp.technologies.split(",").map((t) => t.trim())
              : [];

            return (
              <div key={exp.id} className="exp-card">
                <div className="exp-card-header">
                  <div>
                    <h3 className="exp-role">{exp.position}</h3>
                    <div className="exp-company">🏢 {exp.company}</div>
                  </div>

                  <div className="exp-dates-group">
                    <span className="date-badge">
                      📅 {exp.start_date} — {exp.is_current_job ? "Present" : exp.end_date || "N/A"}
                    </span>
                    {exp.is_current_job && <span className="current-badge">Current Job</span>}
                  </div>
                </div>

                <p className="exp-description">{exp.description}</p>

                {techs.length > 0 && (
                  <div className="tech-tags">
                    {techs.map((tech, idx) => (
                      <span key={idx} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="exp-footer">
                  <span className="sort-order-text">Display Order: #{exp.sort_order ?? 0}</span>
                  <div className="action-buttons">
                    <button className="btn-action btn-edit" onClick={() => openEditModal(exp)}>
                      ✏️ Edit
                    </button>
                    <button className="btn-action btn-delete" onClick={() => openDeleteModal(exp)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT FORM MODAL */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingExperience ? "✏️ Edit Experience" : "➕ Add Work Experience"}
              </h2>
              <button className="close-btn" onClick={() => setShowFormModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Company & Position */}
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      name="company"
                      className="form-input"
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.company && <div className="form-error">{formErrors.company[0]}</div>}
                  </div>
                  <div>
                    <label className="form-label">Position / Role *</label>
                    <input
                      type="text"
                      name="position"
                      className="form-input"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.position && <div className="form-error">{formErrors.position[0]}</div>}
                  </div>
                </div>

                {/* Dates & Current Job Toggle */}
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" }}>
                  <div>
                    <label className="form-label">Start Date *</label>
                    <input
                      type="text"
                      name="start_date"
                      className="form-input"
                      placeholder="e.g. Jan 2022 or 2022-01"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.start_date && <div className="form-error">{formErrors.start_date[0]}</div>}
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <input
                      type="text"
                      name="end_date"
                      className="form-input"
                      placeholder="e.g. Present or Dec 2023"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      disabled={formData.is_current_job}
                      style={{ opacity: formData.is_current_job ? 0.5 : 1 }}
                    />
                    {formErrors.end_date && <div className="form-error">{formErrors.end_date[0]}</div>}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_current_job"
                      className="checkbox-input"
                      checked={formData.is_current_job}
                      onChange={handleInputChange}
                    />
                    <span>💼 I currently work in this role</span>
                  </label>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    placeholder="Describe your responsibilities, key projects, and achievements..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.description && (
                    <div className="form-error">{formErrors.description[0]}</div>
                  )}
                </div>

                {/* Technologies & Sort Order */}
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      name="technologies"
                      className="form-input"
                      placeholder="e.g. React, Node.js, AWS, Docker"
                      value={formData.technologies}
                      onChange={handleInputChange}
                    />
                    {formErrors.technologies && (
                      <div className="form-error">{formErrors.technologies[0]}</div>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Sort Order</label>
                    <input
                      type="number"
                      name="sort_order"
                      className="form-input"
                      placeholder="0"
                      value={formData.sort_order}
                      onChange={handleInputChange}
                    />
                    {formErrors.sort_order && (
                      <div className="form-error">{formErrors.sort_order[0]}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowFormModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editingExperience ? "Update Experience" : "Create Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingExperience && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: "#f87171" }}>
                ⚠️ Delete Experience
              </h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 12px 0" }}>
                Are you sure you want to delete <strong>"{deletingExperience.position}"</strong> at <strong>"{deletingExperience.company}"</strong>?
              </p>
              <p style={{ color: "#b8bee6", fontSize: "0.88rem", margin: 0 }}>
                This work experience record will be permanently removed from your portfolio database.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Cancel
              </button>
              <button
                className="btn-action btn-delete"
                style={{ padding: "10px 20px", fontSize: "0.95rem" }}
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`toast-banner toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.text}</span>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminExperience;
