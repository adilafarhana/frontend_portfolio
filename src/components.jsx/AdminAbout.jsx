import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import apiClient, { getMediaUrl } from "../utils/apiClient";

const AdminAbout = () => {
  const [aboutList, setAboutList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAbout, setEditingAbout] = useState(null); // null = Add, Object = Edit
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAbout, setSelectedAbout] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAbout, setDeletingAbout] = useState(null);

  // Image Upload Type: 'url' or 'file'
  const [imageFileType, setImageFileType] = useState("url");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Professional Highlights dynamic builder
  const [highlightInput, setHighlightInput] = useState("");

  // Toast notification
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    professional_title: "",
    short_intro: "",
    description: "",
    profile_image: "",
    location: "",
    years_experience: "",
    career_summary: "",
    education_summary: "",
    highlights: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const showToastNotification = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchAbout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/admin/about");
      if (res.data && res.data.status) {
        setAboutList(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        setAboutList(res.data);
      } else if (res.data && res.data.data) {
        setAboutList(Array.isArray(res.data.data) ? res.data.data : [res.data.data]);
      } else {
        setAboutList([]);
      }
    } catch (err) {
      console.error("Failed to fetch about data:", err);
      setError("Failed to load About details. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAbout(null);
    setFormData({
      full_name: "",
      professional_title: "",
      short_intro: "",
      description: "",
      profile_image: "",
      location: "",
      years_experience: "",
      career_summary: "",
      education_summary: "",
      highlights: [],
    });
    setImageFileType("url");
    setImageFile(null);
    setImagePreview("");
    setHighlightInput("");
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (item) => {
    setEditingAbout(item);
    
    let parsedHighlights = [];
    if (Array.isArray(item.highlights)) {
      parsedHighlights = item.highlights;
    } else if (typeof item.highlights === "string") {
      try {
        const decoded = JSON.parse(item.highlights);
        parsedHighlights = Array.isArray(decoded) ? decoded : [item.highlights];
      } catch {
        parsedHighlights = item.highlights.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    setFormData({
      full_name: item.full_name || "",
      professional_title: item.professional_title || "",
      short_intro: item.short_intro || "",
      description: item.description || "",
      profile_image: item.profile_image || "",
      location: item.location || "",
      years_experience: item.years_experience || "",
      career_summary: item.career_summary || "",
      education_summary: item.education_summary || "",
      highlights: parsedHighlights,
    });

    setImageFileType("url");
    setImageFile(null);
    setImagePreview(item.profile_image || "");
    setHighlightInput("");
    setFormErrors({});
    setShowFormModal(true);
  };

  const openDetailModal = (item) => {
    setSelectedAbout(item);
    setShowDetailModal(true);
  };

  const openDeleteModal = (item) => {
    setDeletingAbout(item);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (formErrors.profile_image) {
        setFormErrors((prev) => ({ ...prev, profile_image: null }));
      }
    }
  };

  const handleAddHighlight = (e) => {
    e.preventDefault();
    if (highlightInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitting(true);

    try {
      let dataToSend;
      let headers = {};

      if (imageFileType === "file" && imageFile) {
        dataToSend = new FormData();
        dataToSend.append("full_name", formData.full_name);
        dataToSend.append("professional_title", formData.professional_title);
        dataToSend.append("short_intro", formData.short_intro || "");
        dataToSend.append("description", formData.description || "");
        dataToSend.append("location", formData.location || "");
        dataToSend.append("years_experience", formData.years_experience || "");
        dataToSend.append("career_summary", formData.career_summary || "");
        dataToSend.append("education_summary", formData.education_summary || "");
        dataToSend.append("highlights", JSON.stringify(formData.highlights || []));
        dataToSend.append("profile_image", imageFile);
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        dataToSend = {
          full_name: formData.full_name,
          professional_title: formData.professional_title,
          short_intro: formData.short_intro,
          description: formData.description,
          profile_image: formData.profile_image,
          location: formData.location,
          years_experience: formData.years_experience,
          career_summary: formData.career_summary,
          education_summary: formData.education_summary,
          highlights: formData.highlights,
        };
      }

      if (editingAbout) {
        await apiClient.post(`/api/admin/about/${editingAbout.id}`, dataToSend, { headers });
        showToastNotification("success", "About profile updated successfully!");
      } else {
        await apiClient.post("/api/admin/about", dataToSend, { headers });
        showToastNotification("success", "About profile created successfully!");
      }

      setShowFormModal(false);
      fetchAbout();
    } catch (err) {
      console.error("Save About error:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        showToastNotification("error", err.response?.data?.message || "Failed to save About information.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAbout) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/about/${deletingAbout.id}`);
      showToastNotification("success", "About profile deleted successfully!");
      if (selectedAbout && selectedAbout.id === deletingAbout.id) {
        setShowDetailModal(false);
        setSelectedAbout(null);
      }
      setShowDeleteModal(false);
      setDeletingAbout(null);
      fetchAbout();
    } catch (err) {
      console.error("Delete About error:", err);
      showToastNotification("error", "Failed to delete About entry.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter About profiles
  const filteredAboutList = aboutList.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.full_name && item.full_name.toLowerCase().includes(term)) ||
      (item.professional_title && item.professional_title.toLowerCase().includes(term)) ||
      (item.location && item.location.toLowerCase().includes(term)) ||
      (item.short_intro && item.short_intro.toLowerCase().includes(term))
    );
  });

  return (
    <AdminLayout title="About Management">
      <style>{`
        /* Header Actions Bar */
        .about-header-bar {
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

        .btn-add-about {
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

        .btn-add-about:hover {
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

        /* About Cards Grid */
        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .about-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-card);
          position: relative;
          overflow: hidden;
        }

        .about-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
          border-color: rgba(236, 72, 153, 0.45);
        }

        .about-card-top {
          display: flex;
          gap: 18px;
          align-items: center;
        }

        .about-avatar-wrapper {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2));
          border: 2px solid rgba(236, 72, 153, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .about-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-avatar-placeholder {
          font-size: 2rem;
        }

        .about-header-info {
          flex: 1;
          overflow: hidden;
        }

        .about-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .about-title-badge {
          color: #f472b6;
          font-size: 0.88rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 6px;
        }

        .about-meta-row {
          display: flex;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .about-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .about-intro-box {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          background: var(--input-bg);
          border-radius: 14px;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
        }

        .about-highlights-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .highlight-chip {
          background: rgba(236, 72, 153, 0.12);
          border: 1px solid rgba(236, 72, 153, 0.25);
          color: #f472b6;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.76rem;
          font-weight: 600;
        }

        .about-actions-bar {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }

        .btn-card-action {
          border: none;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .btn-card-view {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-main);
          border: 1px solid var(--border-color);
        }

        .btn-card-view:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .btn-card-edit {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }

        .btn-card-edit:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .btn-card-delete {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .btn-card-delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        /* Empty / Error States */
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

        .empty-state h3 {
          color: var(--text-main);
          font-size: 1.3rem;
          margin-bottom: 8px;
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
          max-width: 720px;
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

        /* Form Fields */
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        @media (max-width: 640px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }

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
          min-height: 90px;
        }

        .form-error-msg {
          color: #f87171;
          font-size: 0.8rem;
          margin-top: 5px;
          font-weight: 600;
        }

        /* Image type toggles */
        .image-toggle-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
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

        .image-preview-box {
          margin-top: 10px;
          width: 100px;
          height: 100px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(236, 72, 153, 0.3);
          background: var(--input-bg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-preview-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Highlights Manager */
        .highlight-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .btn-add-tag {
          background: rgba(236, 72, 153, 0.2);
          border: 1px solid #ec4899;
          color: #f472b6;
          padding: 8px 16px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .highlight-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-height: 38px;
          padding: 8px;
          background: var(--input-bg);
          border: 1px dashed var(--border-color);
          border-radius: 12px;
        }

        .highlight-removable-tag {
          background: rgba(236, 72, 153, 0.15);
          border: 1px solid rgba(236, 72, 153, 0.35);
          color: #f472b6;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-remove-tag {
          background: none;
          border: none;
          color: #f87171;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.9rem;
          padding: 0 2px;
        }

        /* Buttons */
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

      {/* Header Actions Bar */}
      <div className="about-header-bar">
        <div className="stats-summary">
          <div className="stat-badge">
            Total Profiles: <strong>{aboutList.length}</strong>
          </div>
          {aboutList.length > 0 && (
            <div className="stat-badge">
              Active Name: <strong>{aboutList[0].full_name}</strong>
            </div>
          )}
        </div>

        <button className="btn-add-about" onClick={openAddModal}>
          ➕ Add About Profile
        </button>
      </div>

      {/* Controls Card */}
      <div className="controls-card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by full name, title, location, or summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading About Details...</h3>
          <p>Connecting to backend API...</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: "#fca5a5" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn-save-modal" style={{ marginTop: "16px" }} onClick={fetchAbout}>
            🔄 Retry
          </button>
        </div>
      ) : filteredAboutList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>No About Details Found</h3>
          <p>
            {searchTerm
              ? "No About profiles match your search criteria."
              : "You haven't added your About profile yet. Click below to add your portfolio About details!"}
          </p>
          {!searchTerm && (
            <button className="btn-add-about" style={{ margin: "18px auto 0 auto" }} onClick={openAddModal}>
              ➕ Create About Profile
            </button>
          )}
        </div>
      ) : (
        /* About Cards Grid */
        <div className="about-grid">
          {filteredAboutList.map((item) => (
            <div key={item.id} className="about-card">
              <div className="about-card-top">
                <div className="about-avatar-wrapper">
                  <img
                    src={item.profile_image ? getMediaUrl(item.profile_image) : "/profile.jpg"}
                    alt={item.full_name}
                    className="about-avatar-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/profile.jpg";
                    }}
                  />
                </div>

                <div className="about-header-info">
                  <div className="about-name">{item.full_name}</div>
                  <div className="about-title-badge">{item.professional_title}</div>
                  <div className="about-meta-row">
                    {item.location && (
                      <span className="about-meta-item">📍 {item.location}</span>
                    )}
                    {item.years_experience && (
                      <span className="about-meta-item">⏱️ {item.years_experience} Exp</span>
                    )}
                  </div>
                </div>
              </div>

              {item.short_intro && (
                <div className="about-intro-box">
                  "{item.short_intro}"
                </div>
              )}

              {item.highlights && Array.isArray(item.highlights) && item.highlights.length > 0 && (
                <div className="about-highlights-preview">
                  {item.highlights.slice(0, 4).map((hl, idx) => (
                    <span key={idx} className="highlight-chip">
                      ✨ {hl}
                    </span>
                  ))}
                  {item.highlights.length > 4 && (
                    <span className="highlight-chip">+{item.highlights.length - 4} more</span>
                  )}
                </div>
              )}

              <div className="about-actions-bar">
                <button className="btn-card-action btn-card-view" onClick={() => openDetailModal(item)}>
                  👁️ Details
                </button>
                <button className="btn-card-action btn-card-edit" onClick={() => openEditModal(item)}>
                  ✏️ Edit
                </button>
                <button className="btn-card-action btn-card-delete" onClick={() => openDeleteModal(item)}>
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
                {editingAbout ? "✏️ Edit About Profile" : "➕ Add About Profile"}
              </h2>
              <button className="close-btn" onClick={() => setShowFormModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Full Name & Title */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      className="form-input"
                      placeholder="e.g. John Doe"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.full_name && (
                      <div className="form-error-msg">{formErrors.full_name[0]}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Title *</label>
                    <input
                      type="text"
                      name="professional_title"
                      className="form-input"
                      placeholder="e.g. Senior Full Stack Developer"
                      value={formData.professional_title}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.professional_title && (
                      <div className="form-error-msg">{formErrors.professional_title[0]}</div>
                    )}
                  </div>
                </div>

                {/* Location & Experience */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-input"
                      placeholder="e.g. San Francisco, CA / Remote"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                    {formErrors.location && (
                      <div className="form-error-msg">{formErrors.location[0]}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input
                      type="text"
                      name="years_experience"
                      className="form-input"
                      placeholder="e.g. 5+ Years"
                      value={formData.years_experience}
                      onChange={handleInputChange}
                    />
                    {formErrors.years_experience && (
                      <div className="form-error-msg">{formErrors.years_experience[0]}</div>
                    )}
                  </div>
                </div>

                {/* Profile Image Source */}
                <div className="form-group">
                  <label className="form-label">Profile Image</label>
                  <div className="image-toggle-bar">
                    <button
                      type="button"
                      className={`btn-toggle-type ${imageFileType === "url" ? "active" : ""}`}
                      onClick={() => setImageFileType("url")}
                    >
                      🌐 Image URL
                    </button>
                    <button
                      type="button"
                      className={`btn-toggle-type ${imageFileType === "file" ? "active" : ""}`}
                      onClick={() => setImageFileType("file")}
                    >
                      📁 Upload File
                    </button>
                  </div>

                  {imageFileType === "url" ? (
                    <input
                      type="url"
                      name="profile_image"
                      className="form-input"
                      placeholder="https://example.com/profile.jpg"
                      value={formData.profile_image}
                      onChange={(e) => {
                        handleInputChange(e);
                        setImagePreview(e.target.value);
                      }}
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      className="form-input"
                      onChange={handleFileChange}
                    />
                  )}

                  {imagePreview && (
                    <div className="image-preview-box">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                  {formErrors.profile_image && (
                    <div className="form-error-msg">{formErrors.profile_image[0]}</div>
                  )}
                </div>

                {/* Short Intro */}
                <div className="form-group">
                  <label className="form-label">Short Introduction</label>
                  <input
                    type="text"
                    name="short_intro"
                    className="form-input"
                    placeholder="e.g. Passionate software engineer creating high performance web apps."
                    value={formData.short_intro}
                    onChange={handleInputChange}
                  />
                  {formErrors.short_intro && (
                    <div className="form-error-msg">{formErrors.short_intro[0]}</div>
                  )}
                </div>

                {/* Detailed About Description */}
                <div className="form-group">
                  <label className="form-label">Detailed About Description</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    rows="4"
                    placeholder="Write a comprehensive story about your background, passions, and design philosophy..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  {formErrors.description && (
                    <div className="form-error-msg">{formErrors.description[0]}</div>
                  )}
                </div>

                {/* Career Summary & Education Summary */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Career Summary</label>
                    <textarea
                      name="career_summary"
                      className="form-textarea"
                      rows="3"
                      placeholder="Brief summary of work history, major companies or client work..."
                      value={formData.career_summary}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Education Summary</label>
                    <textarea
                      name="education_summary"
                      className="form-textarea"
                      rows="3"
                      placeholder="Brief summary of degrees, certifications, or self-taught milestones..."
                      value={formData.education_summary}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Professional Highlights Builder */}
                <div className="form-group">
                  <label className="form-label">Professional Highlights</label>
                  <div className="highlight-input-row">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Led architecture for 10M+ user app, AWS Certified Solutions Architect..."
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddHighlight(e);
                        }
                      }}
                    />
                    <button type="button" className="btn-add-tag" onClick={handleAddHighlight}>
                      + Add
                    </button>
                  </div>

                  <div className="highlight-tags-container">
                    {formData.highlights.length === 0 ? (
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", padding: "4px 8px" }}>
                        No highlights added yet. Type above and click "+ Add" or hit Enter.
                      </span>
                    ) : (
                      formData.highlights.map((hl, idx) => (
                        <div key={idx} className="highlight-removable-tag">
                          <span>✨ {hl}</span>
                          <button
                            type="button"
                            className="btn-remove-tag"
                            onClick={() => handleRemoveHighlight(idx)}
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      ))
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
                <button type="submit" className="btn-save-modal" disabled={submitting}>
                  {submitting ? "Saving..." : editingAbout ? "Update Profile" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && selectedAbout && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">👤 About Profile Overview</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "20px" }}>
                <div className="about-avatar-wrapper" style={{ width: "90px", height: "90px" }}>
                  <img
                    src={selectedAbout.profile_image ? getMediaUrl(selectedAbout.profile_image) : "/profile.jpg"}
                    alt={selectedAbout.full_name}
                    className="about-avatar-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/profile.jpg";
                    }}
                  />
                </div>

                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "1.4rem", color: "var(--text-main)" }}>
                    {selectedAbout.full_name}
                  </h3>
                  <div style={{ color: "#f472b6", fontWeight: "700", fontSize: "1rem" }}>
                    {selectedAbout.professional_title}
                  </div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "6px", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    {selectedAbout.location && <span>📍 {selectedAbout.location}</span>}
                    {selectedAbout.years_experience && <span>⏱️ {selectedAbout.years_experience} Experience</span>}
                  </div>
                </div>
              </div>

              {selectedAbout.short_intro && (
                <div style={{ background: "var(--input-bg)", padding: "14px 18px", borderRadius: "14px", marginBottom: "18px", fontStyle: "italic", borderLeft: "4px solid #ec4899", color: "var(--text-main)" }}>
                  "{selectedAbout.short_intro}"
                </div>
              )}

              {selectedAbout.description && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8c94c5", textTransform: "uppercase", marginBottom: "6px" }}>
                    About Story:
                  </div>
                  <div style={{ lineHeight: "1.7", color: "var(--text-main)", whiteSpace: "pre-wrap" }}>
                    {selectedAbout.description}
                  </div>
                </div>
              )}

              {selectedAbout.career_summary && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8c94c5", textTransform: "uppercase", marginBottom: "6px" }}>
                    💼 Career Summary:
                  </div>
                  <div style={{ lineHeight: "1.6", color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
                    {selectedAbout.career_summary}
                  </div>
                </div>
              )}

              {selectedAbout.education_summary && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8c94c5", textTransform: "uppercase", marginBottom: "6px" }}>
                    🎓 Education Summary:
                  </div>
                  <div style={{ lineHeight: "1.6", color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
                    {selectedAbout.education_summary}
                  </div>
                </div>
              )}

              {selectedAbout.highlights && Array.isArray(selectedAbout.highlights) && selectedAbout.highlights.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8c94c5", textTransform: "uppercase", marginBottom: "8px" }}>
                    ✨ Key Highlights:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedAbout.highlights.map((hl, idx) => (
                      <span key={idx} className="highlight-chip" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                        ✨ {hl}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-card-action btn-card-edit"
                onClick={() => {
                  setShowDetailModal(false);
                  openEditModal(selectedAbout);
                }}
              >
                ✏️ Edit Profile
              </button>
              <button className="btn-cancel" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingAbout && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: "#f87171" }}>
                ⚠️ Delete About Profile
              </h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 12px 0" }}>
                Are you sure you want to delete the profile for <strong>"{deletingAbout.full_name}"</strong>?
              </p>
              <p style={{ color: "#b8bee6", fontSize: "0.88rem", margin: 0 }}>
                This record and associated info will be removed from your portfolio.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Cancel
              </button>
              <button
                className="btn-card-action btn-card-delete"
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

export default AdminAbout;
