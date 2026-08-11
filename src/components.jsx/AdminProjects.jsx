import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import apiClient, { getMediaUrl } from "../utils/apiClient";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = Add, Object = Edit
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);

  // Toast message
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text: '' }

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    project_image: "",
    github_url: "",
    live_demo_url: "",
    featured: false,
    status: "active",
  });
  const [imageFileType, setImageFileType] = useState("url"); // 'url' or 'file'
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToastNotification = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/admin/projects");
      if (res.data && res.data.status) {
        setProjects(res.data.data || []);
      } else {
        setProjects(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      technologies: "",
      project_image: "",
      github_url: "",
      live_demo_url: "",
      featured: false,
      status: "active",
    });
    setImageFileType("url");
    setImageFile(null);
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    let techString = "";
    if (Array.isArray(project.technologies)) {
      techString = project.technologies.join(", ");
    } else if (typeof project.technologies === "string") {
      techString = project.technologies;
    }

    setFormData({
      title: project.title || "",
      description: project.description || "",
      technologies: techString,
      project_image: project.project_image || "",
      github_url: project.github_url || "",
      live_demo_url: project.live_demo_url || "",
      featured: Boolean(project.featured),
      status: project.status || "active",
    });
    setImageFileType("url");
    setImageFile(null);
    setFormErrors({});
    setShowFormModal(true);
  };

  const openDetailModal = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const openDeleteModal = (project) => {
    setDeletingProject(project);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitting(true);

    try {
      let dataToSend;
      let headers = {};

      if (imageFileType === "file" && imageFile) {
        dataToSend = new FormData();
        dataToSend.append("title", formData.title);
        dataToSend.append("description", formData.description);
        dataToSend.append("technologies", formData.technologies);
        dataToSend.append("github_url", formData.github_url);
        dataToSend.append("live_demo_url", formData.live_demo_url);
        dataToSend.append("featured", formData.featured ? "1" : "0");
        dataToSend.append("status", formData.status);
        dataToSend.append("project_image", imageFile);
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        dataToSend = {
          title: formData.title,
          description: formData.description,
          technologies: formData.technologies,
          project_image: formData.project_image,
          github_url: formData.github_url,
          live_demo_url: formData.live_demo_url,
          featured: formData.featured,
          status: formData.status,
        };
      }

      if (editingProject) {
        await apiClient.post(`/api/admin/projects/${editingProject.id}`, dataToSend, { headers });
        showToastNotification("success", "Project updated successfully!");
      } else {
        await apiClient.post("/api/admin/projects", dataToSend, { headers });
        showToastNotification("success", "Project created successfully!");
      }

      setShowFormModal(false);
      fetchProjects();
    } catch (err) {
      console.error("Save project error:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        showToastNotification(
          "error",
          err.response?.data?.message || "Failed to save project. Please check fields."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/projects/${deletingProject.id}`);
      showToastNotification("success", "Project deleted successfully!");
      setShowDeleteModal(false);
      setDeletingProject(null);
      fetchProjects();
    } catch (err) {
      console.error("Delete project error:", err);
      showToastNotification("error", "Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter projects by search and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(project.technologies)
        ? project.technologies.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
        : String(project.technologies || "").toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" ? true : project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const featuredCount = projects.filter((p) => p.featured).length;
  const activeCount = projects.filter((p) => p.status === "active").length;

  return (
    <AdminLayout title="Projects Management">
      <style>{`
        /* Page Header Actions */
        .projects-header-bar {
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
          background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
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
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.35);
          transition: all 0.25s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(168, 85, 247, 0.5);
        }

        /* Search and Filter Bar */
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
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.18);
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
          transition: all 0.25s ease;
        }

        .filter-select:focus {
          border-color: #a855f7;
        }

        .filter-select option {
          background: var(--modal-bg);
          color: var(--text-main);
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 26px;
        }

        .project-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          box-shadow: var(--shadow-card);
        }

        .project-card:hover {
          transform: translateY(-6px);
          border-color: var(--border-glow);
          box-shadow: var(--shadow-lg);
        }

        .project-card:hover {
          transform: translateY(-5px);
          border-color: rgba(168, 85, 247, 0.4);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
        }

        .project-image-banner {
          height: 190px;
          width: 100%;
          object-fit: cover;
          background: #141936;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          transition: transform 0.4s ease;
        }

        .project-card:hover .project-image-banner {
          transform: scale(1.04);
        }

        .project-image-placeholder {
          height: 190px;
          width: 100%;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.2rem;
          color: rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .badge-featured {
          position: absolute;
          top: 14px;
          left: 14px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #ffffff;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 20px;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 10;
        }

        .badge-status {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          text-transform: capitalize;
          z-index: 10;
        }

        .status-active {
          background: rgba(16, 185, 129, 0.22);
          border: 1px solid rgba(16, 185, 129, 0.45);
          color: #34d399;
        }

        .status-completed {
          background: rgba(168, 85, 247, 0.22);
          border: 1px solid rgba(168, 85, 247, 0.45);
          color: #c084fc;
        }

        .status-in_progress {
          background: rgba(59, 130, 246, 0.22);
          border: 1px solid rgba(59, 130, 246, 0.45);
          color: #60a5fa;
        }

        .status-draft {
          background: rgba(156, 163, 175, 0.22);
          border: 1px solid rgba(156, 163, 175, 0.45);
          color: #9ca3af;
        }

        .project-content {
          padding: 22px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .project-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }

        .project-description {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 22px;
        }

        .tech-tag {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          font-size: 0.76rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .project-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .project-links {
          display: flex;
          gap: 10px;
        }

        .link-icon-btn {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 1.05rem;
          padding: 6px 10px;
          border-radius: 10px;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .link-icon-btn:hover {
          color: #ffffff;
          background: rgba(168, 85, 247, 0.25);
          border-color: rgba(168, 85, 247, 0.4);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          border: none;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-view {
          background: rgba(59, 130, 246, 0.16);
          border: 1px solid rgba(59, 130, 246, 0.35);
          color: #93c5fd;
        }

        .btn-view:hover {
          background: rgba(59, 130, 246, 0.35);
          color: #ffffff;
        }

        .btn-edit {
          background: rgba(168, 85, 247, 0.16);
          border: 1px solid rgba(168, 85, 247, 0.35);
          color: #d8b4fe;
        }

        .btn-edit:hover {
          background: rgba(168, 85, 247, 0.35);
          color: #ffffff;
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.16);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #fca5a5;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.35);
          color: #ffffff;
        }

        /* Modal Overlay & Card */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 7, 18, 0.88);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          background: var(--modal-bg);
          border: 1px solid var(--border-color);
          border-radius: 28px;
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          animation: modalFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);
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
          background: rgba(168, 85, 247, 0.1);
        }

        .modal-body {
          padding: 24px;
          flex: 1;
        }

        /* Form Controls */
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

        .form-input, .form-textarea, .form-select {
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

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }

        .form-textarea {
          min-height: 110px;
          resize: vertical;
        }

        .form-select option {
          background: var(--modal-bg);
          color: var(--text-main);
        }

        .form-error {
          color: #f87171;
          font-size: 0.8rem;
          margin-top: 6px;
        }

        .image-type-toggle {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
        }

        .toggle-tab {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: #b8bee6;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .toggle-tab.active {
          background: rgba(168, 85, 247, 0.2);
          border-color: rgba(168, 85, 247, 0.4);
          color: #ffffff;
          font-weight: 600;
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
          accent-color: #a855f7;
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

        /* Detail Modal Styles */
        .detail-banner {
          width: 100%;
          max-height: 280px;
          object-fit: cover;
          border-radius: 16px;
          margin-bottom: 20px;
          background: #141936;
        }

        .detail-meta-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .detail-description {
          font-size: 0.95rem;
          color: #d1d5db;
          line-height: 1.7;
          margin-bottom: 24px;
          white-space: pre-wrap;
        }

        .detail-section-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #8c94c5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
        }

        .detail-links-group {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .detail-link-btn {
          padding: 10px 18px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .github-link {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .github-link:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .demo-link {
          background: linear-gradient(135deg, #a855f7, #6366f1);
          color: #ffffff;
        }

        .demo-link:hover {
          box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
        }

        /* Toast Notifications */
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
      <div className="projects-header-bar">
        <div className="stats-summary">
          <div className="stat-badge">
            Total Projects: <strong>{projects.length}</strong>
          </div>
          <div className="stat-badge">
            Featured: <strong>{featuredCount}</strong>
          </div>
          <div className="stat-badge">
            Active: <strong>{activeCount}</strong>
          </div>
        </div>

        <button className="btn-primary" onClick={openAddModal}>
          <span>➕</span> Add New Project
        </button>
      </div>

      {/* Controls Bar: Search & Filter */}
      <div className="controls-card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search projects by title or technology..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading projects...</h3>
          <p>Connecting to backend API...</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: "#fca5a5" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn-primary" style={{ margin: "16px auto 0 auto" }} onClick={fetchProjects}>
            🔄 Retry
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No Projects Found</h3>
          <p>
            {searchTerm || statusFilter !== "all"
              ? "No projects match your current filter settings."
              : "No projects have been added yet. Click 'Add New Project' to create your first portfolio entry!"}
          </p>
        </div>
      ) : (
        /* Projects Cards Grid */
        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const techs = Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === "string"
              ? project.technologies.split(",").map((t) => t.trim())
              : [];

            return (
              <div key={project.id} className="project-card">
                {project.featured && (
                  <div className="badge-featured">
                    <span>★</span> Featured
                  </div>
                )}

                <div className={`badge-status status-${project.status || "active"}`}>
                  {project.status ? project.status.replace("_", " ") : "active"}
                </div>

                {project.project_image ? (
                  <img
                    src={getMediaUrl(project.project_image)}
                    alt={project.title}
                    className="project-image-banner"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="project-image-placeholder"
                  style={{ display: project.project_image ? "none" : "flex" }}
                >
                  💻
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  {techs.length > 0 && (
                    <div className="tech-tags">
                      {techs.map((tech, idx) => (
                        <span key={idx} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="project-footer">
                    <div className="project-links">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-icon-btn"
                          title="GitHub Repository"
                        >
                          🐙
                        </a>
                      )}
                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-icon-btn"
                          title="Live Demo"
                        >
                          🚀
                        </a>
                      )}
                    </div>

                    <div className="action-buttons">
                      <button
                        className="btn-action btn-view"
                        onClick={() => openDetailModal(project)}
                        title="View Details"
                      >
                        👁️ View
                      </button>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => openEditModal(project)}
                        title="Edit Project"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => openDeleteModal(project)}
                        title="Delete Project"
                      >
                        🗑️
                      </button>
                    </div>
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
                {editingProject ? "✏️ Edit Project" : "➕ Add New Project"}
              </h2>
              <button className="close-btn" onClick={() => setShowFormModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Title */}
                <div className="form-group">
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="e.g. AI Portfolio Dashboard"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.title && <div className="form-error">{formErrors.title[0]}</div>}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    placeholder="Brief overview of what this project does and key features..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.description && (
                    <div className="form-error">{formErrors.description[0]}</div>
                  )}
                </div>

                {/* Technologies */}
                <div className="form-group">
                  <label className="form-label">Technologies (comma separated)</label>
                  <input
                    type="text"
                    name="technologies"
                    className="form-input"
                    placeholder="e.g. React, Laravel, MySQL, Tailwind CSS"
                    value={formData.technologies}
                    onChange={handleInputChange}
                  />
                  {formErrors.technologies && (
                    <div className="form-error">{formErrors.technologies[0]}</div>
                  )}
                </div>

                {/* Image Input (URL vs File) */}
                <div className="form-group">
                  <label className="form-label">Project Image</label>
                  <div className="image-type-toggle">
                    <button
                      type="button"
                      className={`toggle-tab ${imageFileType === "url" ? "active" : ""}`}
                      onClick={() => setImageFileType("url")}
                    >
                      🌐 Image URL
                    </button>
                    <button
                      type="button"
                      className={`toggle-tab ${imageFileType === "file" ? "active" : ""}`}
                      onClick={() => setImageFileType("file")}
                    >
                      📁 Upload File
                    </button>
                  </div>

                  {imageFileType === "url" ? (
                    <input
                      type="text"
                      name="project_image"
                      className="form-input"
                      placeholder="https://example.com/image.png"
                      value={formData.project_image}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      className="form-input"
                      onChange={(e) => setImageFile(e.target.files[0] || null)}
                    />
                  )}
                  {formErrors.project_image && (
                    <div className="form-error">{formErrors.project_image[0]}</div>
                  )}
                </div>

                {/* URLs */}
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">GitHub URL</label>
                    <input
                      type="url"
                      name="github_url"
                      className="form-input"
                      placeholder="https://github.com/user/repo"
                      value={formData.github_url}
                      onChange={handleInputChange}
                    />
                    {formErrors.github_url && (
                      <div className="form-error">{formErrors.github_url[0]}</div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Live Demo URL</label>
                    <input
                      type="url"
                      name="live_demo_url"
                      className="form-input"
                      placeholder="https://my-demo.com"
                      value={formData.live_demo_url}
                      onChange={handleInputChange}
                    />
                    {formErrors.live_demo_url && (
                      <div className="form-error">{formErrors.live_demo_url[0]}</div>
                    )}
                  </div>
                </div>

                {/* Status & Featured */}
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "center" }}>
                  <div>
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div style={{ paddingTop: "24px" }}>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="featured"
                        className="checkbox-input"
                        checked={formData.featured}
                        onChange={handleInputChange}
                      />
                      <span>★ Featured Project</span>
                    </label>
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
                  {submitting ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PROJECT DETAILS MODAL */}
      {showDetailModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">🔍 Project Details</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {selectedProject.project_image && (
                <img
                  src={getMediaUrl(selectedProject.project_image)}
                  alt={selectedProject.title}
                  className="detail-banner"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}

              <h2 style={{ fontSize: "1.5rem", margin: "0 0 10px 0", color: "#fff" }}>
                {selectedProject.title}
              </h2>

              <div className="detail-meta-bar">
                {selectedProject.featured && (
                  <div className="badge-featured" style={{ position: "static" }}>
                    ★ Featured
                  </div>
                )}
                <div
                  className={`badge-status status-${selectedProject.status || "active"}`}
                  style={{ position: "static" }}
                >
                  {selectedProject.status ? selectedProject.status.replace("_", " ") : "active"}
                </div>
              </div>

              <div className="detail-section-title">Description</div>
              <p className="detail-description">{selectedProject.description}</p>

              <div className="detail-section-title">Technologies Used</div>
              <div className="tech-tags" style={{ marginBottom: "24px" }}>
                {(Array.isArray(selectedProject.technologies)
                  ? selectedProject.technologies
                  : typeof selectedProject.technologies === "string"
                  ? selectedProject.technologies.split(",")
                  : []
                ).map((tech, idx) => (
                  <span key={idx} className="tech-tag" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
                    {tech.trim()}
                  </span>
                ))}
              </div>

              <div className="detail-links-group">
                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link-btn github-link"
                  >
                    🐙 View Code on GitHub
                  </a>
                )}
                {selectedProject.live_demo_url && (
                  <a
                    href={selectedProject.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link-btn demo-link"
                  >
                    🚀 Open Live Demo
                  </a>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => {
                  setShowDetailModal(false);
                  openEditModal(selectedProject);
                }}
              >
                ✏️ Edit Project
              </button>
              <button className="btn-cancel" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingProject && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: "#f87171" }}>
                ⚠️ Delete Project
              </h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 12px 0" }}>
                Are you sure you want to delete <strong>"{deletingProject.title}"</strong>?
              </p>
              <p style={{ color: "#b8bee6", fontSize: "0.88rem", margin: 0 }}>
                This action cannot be undone. The project record will be permanently removed from your portfolio database.
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

export default AdminProjects;
