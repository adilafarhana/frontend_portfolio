import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import apiClient, { getMediaUrl } from "../utils/apiClient";

const AdminResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingResume, setEditingResume] = useState(null); // null = Add, Object = Edit
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewResume, setPreviewResume] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingResume, setDeletingResume] = useState(null);

  // Upload type: 'file' or 'url'
  const [uploadType, setUploadType] = useState("file");
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  // Toast notification
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_path: "",
    is_active: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const showToastNotification = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/admin/resume");
      if (res.data && res.data.status) {
        setResumes(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        setResumes(res.data);
      } else {
        setResumes([]);
      }
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      setError("Failed to load resumes. Please check your connection or backend server.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingResume(null);
    setFormData({
      title: "Full Stack Engineer Resume",
      description: "",
      file_path: "",
      is_active: true,
    });
    setUploadType("file");
    setResumeFile(null);
    setSelectedFileName("");
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (item) => {
    setEditingResume(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      file_path: item.file_path || "",
      is_active: Boolean(item.is_active),
    });
    setUploadType(item.file_path && !item.file_name ? "url" : "file");
    setResumeFile(null);
    setSelectedFileName(item.file_name || "");
    setFormErrors({});
    setShowFormModal(true);
  };

  const openPreviewModal = (item) => {
    setPreviewResume(item);
    setShowPreviewModal(true);
  };

  const openDeleteModal = (item) => {
    setDeletingResume(item);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setSelectedFileName(file.name);
      if (formErrors.resume_file) {
        setFormErrors((prev) => ({ ...prev, resume_file: null }));
      }
    }
  };

  const handleToggleActive = async (item, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await apiClient.patch(`/api/admin/resume/${item.id}/active`);
      showToastNotification("success", res.data?.message || "Resume status updated!");
      fetchResumes();
    } catch (err) {
      console.error("Toggle active error:", err);
      showToastNotification("error", "Failed to update resume active status.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitting(true);

    try {
      let dataToSend;
      let headers = {};

      if (uploadType === "file" && resumeFile) {
        dataToSend = new FormData();
        dataToSend.append("title", formData.title);
        dataToSend.append("description", formData.description || "");
        dataToSend.append("is_active", formData.is_active ? "1" : "0");
        dataToSend.append("resume_file", resumeFile);
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        dataToSend = {
          title: formData.title,
          description: formData.description,
          file_path: formData.file_path,
          is_active: formData.is_active,
        };
      }

      if (editingResume) {
        await apiClient.post(`/api/admin/resume/${editingResume.id}`, dataToSend, { headers });
        showToastNotification("success", "Resume document updated successfully!");
      } else {
        await apiClient.post("/api/admin/resume", dataToSend, { headers });
        showToastNotification("success", "Resume uploaded successfully!");
      }

      setShowFormModal(false);
      fetchResumes();
    } catch (err) {
      console.error("Save resume error:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        showToastNotification("error", err.response?.data?.message || "Failed to save resume document.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingResume) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/resume/${deletingResume.id}`);
      showToastNotification("success", "Resume document removed successfully!");
      if (previewResume && previewResume.id === deletingResume.id) {
        setShowPreviewModal(false);
        setPreviewResume(null);
      }
      setShowDeleteModal(false);
      setDeletingResume(null);
      fetchResumes();
    } catch (err) {
      console.error("Delete resume error:", err);
      showToastNotification("error", "Failed to delete resume.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter resumes
  const filteredResumes = resumes.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.file_name && item.file_name.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? item.is_active
        : !item.is_active;

    return matchesSearch && matchesStatus;
  });

  const activeResume = resumes.find((r) => r.is_active);

  return (
    <AdminLayout title="Resume Management">
      <style>{`
        /* Header Bar */
        .resume-header-bar {
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

        .stat-badge.active-alert {
          border-color: rgba(16, 185, 129, 0.45);
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
        }

        .stat-badge.active-alert strong {
          color: #34d399;
        }

        .btn-add-resume {
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.35);
        }

        .btn-add-resume:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(236, 72, 153, 0.5);
        }

        /* Controls Card */
        .controls-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 18px 22px;
          margin-bottom: 28px;
          display: flex;
          gap: 18px;
          align-items: center;
          flex-wrap: wrap;
          backdrop-filter: blur(12px);
          box-shadow: var(--shadow-card);
        }

        .search-wrapper {
          flex: 1;
          min-width: 260px;
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
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.18);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 1rem;
        }

        .filter-select {
          padding: 12px 18px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 12px;
          color: var(--text-main);
          font-size: 0.92rem;
          outline: none;
          cursor: pointer;
        }

        .filter-select option {
          background: var(--modal-bg);
          color: var(--text-main);
        }

        /* Resume Grid */
        .resume-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .resume-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-card);
          position: relative;
        }

        .resume-card.active-card {
          border-color: rgba(16, 185, 129, 0.4);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(22, 18, 14, 0.95));
        }

        .resume-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
        }

        .resume-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
        }

        .resume-icon-badge {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid rgba(236, 72, 153, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          flex-shrink: 0;
        }

        .status-pill {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .status-pill.active {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
        }

        .status-pill.inactive {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: var(--text-muted);
        }

        .resume-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .resume-description {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .resume-meta-box {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .resume-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .resume-actions-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }

        .btn-action-small {
          border: none;
          padding: 7px 12px;
          border-radius: 9px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-decoration: none;
        }

        .btn-view {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }

        .btn-view:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .btn-activate {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }

        .btn-activate:hover {
          background: rgba(16, 185, 129, 0.3);
        }

        .btn-edit {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-color);
          color: var(--text-main);
        }

        .btn-edit:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        /* Upload Dropzone Box */
        .dropzone-box {
          border: 2px dashed rgba(236, 72, 153, 0.4);
          background: rgba(236, 72, 153, 0.04);
          border-radius: 18px;
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .dropzone-box:hover {
          border-color: #ec4899;
          background: rgba(236, 72, 153, 0.08);
        }

        .dropzone-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .dropzone-icon {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }

        .file-selected-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.88rem;
          margin-top: 10px;
        }

        /* Modal Overlay & Base */
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

        .preview-modal-card {
          max-width: 900px;
          height: 85vh;
          display: flex;
          flex-direction: column;
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
          position: sticky;
          top: 0;
          background: var(--modal-bg);
          z-index: 10;
        }

        .modal-title {
          font-size: 1.3rem;
          font-weight: 800;
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
          background: rgba(236, 72, 153, 0.1);
        }

        .modal-body {
          padding: 24px;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          position: sticky;
          bottom: 0;
          background: var(--modal-bg);
          z-index: 10;
        }

        /* Form elements */
        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 12px;
          color: var(--text-main);
          font-size: 0.92rem;
          outline: none;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.18);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-error-msg {
          color: #f87171;
          font-size: 0.8rem;
          margin-top: 5px;
          font-weight: 600;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .checkbox-row input {
          width: 18px;
          height: 18px;
          accent-color: #ec4899;
          cursor: pointer;
        }

        .btn-toggle-type {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-toggle-type.active {
          background: rgba(236, 72, 153, 0.2);
          border-color: #ec4899;
          color: #f472b6;
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
          color: #ffffff;
        }

        .btn-save-modal {
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          color: #ffffff;
          border: none;
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.35);
        }

        .btn-save-modal:hover {
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.5);
        }

        /* Empty state */
        .empty-state {
          background: var(--bg-card);
          border: 1px dashed var(--border-color);
          border-radius: 24px;
          padding: 60px 20px;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-icon {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }

        /* Toast Banner */
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

      {/* Header Bar */}
      <div className="resume-header-bar">
        <div className="stats-summary">
          <div className="stat-badge">
            Total Resumes: <strong>{resumes.length}</strong>
          </div>
          <div className={`stat-badge ${activeResume ? "active-alert" : ""}`}>
            Active: <strong>{activeResume ? activeResume.title : "None Active"}</strong>
          </div>
        </div>

        <button className="btn-add-resume" onClick={openAddModal}>
          📤 Upload New Resume
        </button>
      </div>

      {/* Controls Card */}
      <div className="controls-card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, file name, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Resumes</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Loading / Error States */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading resumes...</h3>
          <p>Connecting to backend API...</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: "#fca5a5" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn-save-modal" style={{ marginTop: "16px" }} onClick={fetchResumes}>
            🔄 Retry
          </button>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No Resume Documents Found</h3>
          <p>
            {searchTerm || statusFilter !== "all"
              ? "No resume files match your search criteria."
              : "You haven't uploaded a resume yet. Upload your PDF or DOCX file to enable portfolio downloads!"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <button className="btn-add-resume" style={{ margin: "18px auto 0 auto" }} onClick={openAddModal}>
              📤 Upload Resume
            </button>
          )}
        </div>
      ) : (
        /* Resume Cards Grid */
        <div className="resume-grid">
          {filteredResumes.map((item) => (
            <div key={item.id} className={`resume-card ${item.is_active ? "active-card" : ""}`}>
              <div className="resume-card-header">
                <div className="resume-icon-badge">📄</div>
                <span className={`status-pill ${item.is_active ? "active" : "inactive"}`}>
                  {item.is_active ? "🟢 Active on Site" : "⚪ Inactive"}
                </span>
              </div>

              <div>
                <h3 className="resume-title">{item.title}</h3>
                {item.description && (
                  <p className="resume-description">{item.description}</p>
                )}
              </div>

              <div className="resume-meta-box">
                <div className="resume-meta-row">
                  <span>📁 File:</span>
                  <strong style={{ color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
                    {item.file_name || "Document Link"}
                  </strong>
                </div>
                {item.file_size && (
                  <div className="resume-meta-row">
                    <span>⚖️ Size:</span>
                    <span>{item.file_size}</span>
                  </div>
                )}
                <div className="resume-meta-row">
                  <span>📅 Uploaded:</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="resume-actions-bar">
                <button className="btn-action-small btn-view" onClick={() => openPreviewModal(item)}>
                  👁️ Preview
                </button>
                <a
                  href={getMediaUrl(item.file_path)}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="btn-action-small btn-edit"
                  title="Download File"
                >
                  📥 Download
                </a>
                <button
                  className={`btn-action-small ${item.is_active ? "btn-edit" : "btn-activate"}`}
                  onClick={(e) => handleToggleActive(item, e)}
                  title={item.is_active ? "Deactivate" : "Set as Active on Portfolio"}
                >
                  {item.is_active ? "Deactivate" : "⚡ Set Active"}
                </button>
                <button className="btn-action-small btn-edit" onClick={() => openEditModal(item)}>
                  ✏️
                </button>
                <button className="btn-action-small btn-delete" onClick={() => openDeleteModal(item)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD / EDIT MODAL */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingResume ? "✏️ Edit Resume Details" : "📤 Upload Resume Document"}
              </h2>
              <button className="close-btn" onClick={() => setShowFormModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Resume Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="e.g. Senior Full Stack Engineer Resume 2026"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.title && (
                    <div className="form-error-msg">{formErrors.title[0]}</div>
                  )}
                </div>

                {/* Upload or URL selector */}
                <div className="form-group">
                  <label className="form-label">Document Source</label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <button
                      type="button"
                      className={`btn-toggle-type ${uploadType === "file" ? "active" : ""}`}
                      onClick={() => setUploadType("file")}
                    >
                      📁 Upload File (PDF / DOCX)
                    </button>
                    <button
                      type="button"
                      className={`btn-toggle-type ${uploadType === "url" ? "active" : ""}`}
                      onClick={() => setUploadType("url")}
                    >
                      🌐 Direct URL / Google Drive
                    </button>
                  </div>

                  {uploadType === "file" ? (
                    <div className="dropzone-box">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="dropzone-input"
                        onChange={handleFileChange}
                      />
                      <div className="dropzone-icon">📄</div>
                      <div style={{ color: "var(--text-main)", fontWeight: "700" }}>
                        Click or Drag & Drop Resume File Here
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>
                        Supports PDF, DOC, DOCX up to 10MB
                      </div>

                      {selectedFileName && (
                        <div className="file-selected-pill">
                          <span>✅ Selected:</span>
                          <span>{selectedFileName}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      name="file_path"
                      className="form-input"
                      placeholder="https://example.com/my-resume.pdf"
                      value={formData.file_path}
                      onChange={handleInputChange}
                    />
                  )}

                  {formErrors.resume_file && (
                    <div className="form-error-msg">{formErrors.resume_file[0]}</div>
                  )}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Notes / Description (Optional)</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    rows="3"
                    placeholder="e.g. Tailored for Backend & Cloud engineering roles..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Active Checkbox */}
                <div className="form-group">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                    />
                    <span style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.92rem" }}>
                      Set as Primary Active Resume on Portfolio Site
                    </span>
                  </label>
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
                <button type="submit" className="btn-save-modal" disabled={submitting}>
                  {submitting ? "Saving..." : editingResume ? "Update Resume" : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {showPreviewModal && previewResume && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-card preview-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{previewResume.title}</h2>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  {previewResume.file_name} ({previewResume.file_size})
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <a
                  href={getMediaUrl(previewResume.file_path)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-action-small btn-view"
                  style={{ padding: "8px 14px" }}
                >
                  ↗️ Open in Tab
                </a>
                <a
                  href={getMediaUrl(previewResume.file_path)}
                  download
                  className="btn-action-small btn-activate"
                  style={{ padding: "8px 14px" }}
                >
                  📥 Download
                </a>
                <button className="close-btn" onClick={() => setShowPreviewModal(false)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="modal-body" style={{ padding: 0, flex: 1, overflow: "hidden", background: "#1e1e1e", position: "relative" }}>
              <object
                data={getMediaUrl(previewResume.file_path)}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              >
                <iframe
                  src={getMediaUrl(previewResume.file_path)}
                  title={previewResume.title}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                >
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#ffffff" }}>
                    <p style={{ fontSize: "1.1rem", marginBottom: "16px" }}>
                      Your browser does not support embedded PDF preview.
                    </p>
                    <a
                      href={getMediaUrl(previewResume.file_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-save-modal"
                      style={{ textDecoration: "none", display: "inline-block" }}
                    >
                      ↗️ View or Download Document
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingResume && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: "#f87171" }}>
                ⚠️ Delete Resume
              </h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 12px 0" }}>
                Are you sure you want to delete <strong>"{deletingResume.title}"</strong>?
              </p>
              <p style={{ color: "#b8bee6", fontSize: "0.88rem", margin: 0 }}>
                This resume file and record will be permanently deleted.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Cancel
              </button>
              <button
                className="btn-action-small btn-delete"
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

export default AdminResume;
