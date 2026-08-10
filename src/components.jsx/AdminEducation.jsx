import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import apiClient from "../utils/apiClient";

const AdminEducation = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null); // null = Add, Object = Edit
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEducation, setDeletingEducation] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    start_year: "",
    end_year: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const showToastNotification = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchEducation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/admin/education");
      if (res.data && res.data.status) {
        setEducationList(res.data.data || []);
      } else {
        setEducationList(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch education:", err);
      setError("Failed to load education records. Please check your connection or server.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingEducation(null);
    setFormData({
      institution: "",
      degree: "",
      start_year: new Date().getFullYear().toString(),
      end_year: "",
      description: "",
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (edu) => {
    setEditingEducation(edu);
    setFormData({
      institution: edu.institution || "",
      degree: edu.degree || "",
      start_year: edu.start_year || "",
      end_year: edu.end_year || "",
      description: edu.description || "",
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const openDeleteModal = (edu) => {
    setDeletingEducation(edu);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        institution: formData.institution,
        degree: formData.degree,
        start_year: formData.start_year,
        end_year: formData.end_year,
        description: formData.description,
      };

      if (editingEducation) {
        await apiClient.put(`/api/admin/education/${editingEducation.id}`, payload);
        showToastNotification("success", "Education record updated successfully!");
      } else {
        await apiClient.post("/api/admin/education", payload);
        showToastNotification("success", "Education record added successfully!");
      }

      setShowFormModal(false);
      fetchEducation();
    } catch (err) {
      console.error("Save education error:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        showToastNotification("error", err.response?.data?.message || "Failed to save education record.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEducation) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/education/${deletingEducation.id}`);
      showToastNotification("success", "Education record deleted successfully!");
      setShowDeleteModal(false);
      setDeletingEducation(null);
      fetchEducation();
    } catch (err) {
      console.error("Delete education error:", err);
      showToastNotification("error", "Failed to delete education record.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter education list
  const filteredEducation = educationList.filter((edu) => {
    const term = searchTerm.toLowerCase();
    const matchesInstitution = edu.institution.toLowerCase().includes(term);
    const matchesDegree = edu.degree.toLowerCase().includes(term);
    const matchesDescription = edu.description && edu.description.toLowerCase().includes(term);
    return matchesInstitution || matchesDegree || matchesDescription;
  });

  return (
    <AdminLayout title="Education Management">
      <style>{`
        /* Header bar */
        .edu-header-bar {
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
          background: rgba(13, 17, 38, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 18px;
          border-radius: 14px;
          font-size: 0.88rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .stat-badge strong {
          color: #ffffff;
          margin-left: 6px;
          font-weight: 800;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
          transition: all 0.25s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(245, 158, 11, 0.5);
        }

        /* Controls bar */
        .controls-card {
          background: rgba(13, 17, 38, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 18px 22px;
          margin-bottom: 28px;
          backdrop-filter: blur(12px);
        }

        .search-wrapper {
          width: 100%;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 18px 12px 42px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #fff;
          font-size: 0.92rem;
          outline: none;
          transition: all 0.25s ease;
        }

        .search-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1rem;
        }

        /* Education Grid */
        .edu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 24px;
        }

        .edu-card {
          background: rgba(13, 17, 38, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .edu-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.4);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
        }

        .edu-degree {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }

        .edu-institution {
          font-size: 0.98rem;
          font-weight: 700;
          color: #fbbf24;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .edu-year-badge {
          background: rgba(245, 158, 11, 0.16);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fef08a;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 12px;
          align-self: flex-start;
        }

        .edu-description {
          font-size: 0.92rem;
          color: #cbd5e1;
          line-height: 1.65;
          margin: 0;
        }

        .edu-card-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: flex-end;
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
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #fde047;
        }

        .btn-edit:hover {
          background: rgba(245, 158, 11, 0.3);
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
          background: #0d1126;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          width: 100%;
          max-width: 580px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          animation: modalFade 0.25s ease-out;
        }

        @keyframes modalFade {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #8c94c5;
          font-size: 1.4rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
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
          color: #d8dbf3;
          margin-bottom: 8px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-error {
          color: #f87171;
          font-size: 0.8rem;
          margin-top: 6px;
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
      <div className="edu-header-bar">
        <div className="stats-summary">
          <div className="stat-badge">
            Total Education Records: <strong>{educationList.length}</strong>
          </div>
        </div>

        <button className="btn-primary" onClick={openAddModal}>
          <span>➕</span> Add Education
        </button>
      </div>

      {/* Controls Bar: Search */}
      <div className="controls-card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search education by institution, degree, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading education records...</h3>
          <p>Connecting to backend API...</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: "#fca5a5" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn-primary" style={{ margin: "16px auto 0 auto" }} onClick={fetchEducation}>
            🔄 Retry
          </button>
        </div>
      ) : filteredEducation.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No Education Records Found</h3>
          <p>
            {searchTerm
              ? "No education records match your search filter."
              : "No education records added yet. Click 'Add Education' to insert your academic history!"}
          </p>
        </div>
      ) : (
        /* Education Grid Cards */
        <div className="edu-grid">
          {filteredEducation.map((edu) => (
            <div key={edu.id} className="edu-card">
              <div className="edu-icon-badge">🎓</div>
              <h3 className="edu-degree">{edu.degree}</h3>
              <div className="edu-institution">🏛️ {edu.institution}</div>

              <div className="year-badge">
                📅 {edu.start_year} — {edu.end_year || "Present"}
              </div>

              {edu.description && <p className="edu-description">{edu.description}</p>}

              <div className="edu-footer">
                <button className="btn-action btn-edit" onClick={() => openEditModal(edu)}>
                  ✏️ Edit
                </button>
                <button className="btn-action btn-delete" onClick={() => openDeleteModal(edu)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT FORM MODAL */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingEducation ? "✏️ Edit Education Record" : "➕ Add Education Record"}
              </h2>
              <button className="close-btn" onClick={() => setShowFormModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Institution */}
                <div className="form-group">
                  <label className="form-label">Institution / University *</label>
                  <input
                    type="text"
                    name="institution"
                    className="form-input"
                    placeholder="e.g. Stanford University"
                    value={formData.institution}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.institution && (
                    <div className="form-error">{formErrors.institution[0]}</div>
                  )}
                </div>

                {/* Degree */}
                <div className="form-group">
                  <label className="form-label">Degree / Field of Study *</label>
                  <input
                    type="text"
                    name="degree"
                    className="form-input"
                    placeholder="e.g. B.S. in Computer Science"
                    value={formData.degree}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.degree && <div className="form-error">{formErrors.degree[0]}</div>}
                </div>

                {/* Start & End Year */}
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Start Year *</label>
                    <input
                      type="text"
                      name="start_year"
                      className="form-input"
                      placeholder="e.g. 2018"
                      value={formData.start_year}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.start_year && (
                      <div className="form-error">{formErrors.start_year[0]}</div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">End Year</label>
                    <input
                      type="text"
                      name="end_year"
                      className="form-input"
                      placeholder="e.g. 2022 or Present"
                      value={formData.end_year}
                      onChange={handleInputChange}
                    />
                    {formErrors.end_year && (
                      <div className="form-error">{formErrors.end_year[0]}</div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description / Achievements</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    placeholder="Specializations, honors, GPA, relevant coursework, etc..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  {formErrors.description && (
                    <div className="form-error">{formErrors.description[0]}</div>
                  )}
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
                  {submitting ? "Saving..." : editingEducation ? "Update Record" : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingEducation && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: "#f87171" }}>
                ⚠️ Delete Education Record
              </h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 12px 0" }}>
                Are you sure you want to delete <strong>"{deletingEducation.degree}"</strong> from <strong>"{deletingEducation.institution}"</strong>?
              </p>
              <p style={{ color: "#b8bee6", fontSize: "0.88rem", margin: 0 }}>
                This education record will be permanently removed from your portfolio database.
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

export default AdminEducation;
