import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import apiClient from "../utils/apiClient";

const CATEGORIES = ["Backend", "Frontend", "Database", "Tools", "DevOps"];

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null); // null = Add, Object = Edit
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Backend",
    icon: "⚡",
    sort_order: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const showToastNotification = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/admin/skills");
      if (res.data && res.data.status) {
        setSkills(res.data.data || []);
      } else {
        setSkills(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      setError("Failed to load skills. Please check your network connection or server.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: selectedCategory !== "all" ? selectedCategory : "Backend",
      icon: "⚡",
      sort_order: skills.length + 1,
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      category: skill.category || "Backend",
      icon: skill.icon || "⚡",
      sort_order: skill.sort_order ?? 0,
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const openDeleteModal = (skill) => {
    setDeletingSkill(skill);
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
        name: formData.name,
        category: formData.category,
        icon: formData.icon,
        sort_order: parseInt(formData.sort_order, 10) || 0,
      };

      if (editingSkill) {
        await apiClient.put(`/api/admin/skills/${editingSkill.id}`, payload);
        showToastNotification("success", "Skill updated successfully!");
      } else {
        await apiClient.post("/api/admin/skills", payload);
        showToastNotification("success", "Skill added successfully!");
      }

      setShowFormModal(false);
      fetchSkills();
    } catch (err) {
      console.error("Save skill error:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        showToastNotification("error", err.response?.data?.message || "Failed to save skill.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSkill) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/skills/${deletingSkill.id}`);
      showToastNotification("success", "Skill deleted successfully!");
      setShowDeleteModal(false);
      setDeletingSkill(null);
      fetchSkills();
    } catch (err) {
      console.error("Delete skill error:", err);
      showToastNotification("error", "Failed to delete skill.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" ? true : skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group skills by category for organized view
  const groupedSkills = CATEGORIES.reduce((acc, cat) => {
    const items = filteredSkills.filter((s) => s.category === cat);
    if (items.length > 0 || (selectedCategory !== "all" && selectedCategory === cat)) {
      acc[cat] = items;
    }
    return acc;
  }, {});

  return (
    <AdminLayout title="Skills Management">
      <style>{`
        /* Header bar */
        .skills-header-bar {
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
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
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
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
          transition: all 0.25s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(59, 130, 246, 0.5);
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
          flex-wrap: wrap;
          backdrop-filter: blur(12px);
          box-shadow: var(--shadow-card);
        }

        .search-wrapper {
          flex: 1;
          min-width: 240px;
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
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 1rem;
        }

        .category-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .category-tab {
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--input-bg);
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .category-tab:hover {
          color: var(--text-main);
          background: rgba(59, 130, 246, 0.1);
        }

        .category-tab.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(6, 182, 212, 0.2));
          border-color: rgba(59, 130, 246, 0.4);
          color: var(--text-main);
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
        }

        /* Category Section Header */
        .category-section {
          margin-bottom: 36px;
        }

        .category-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #60a5fa;
          margin: 0 0 18px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: -0.02em;
        }

        .category-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.3), var(--border-color));
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 18px;
        }

        .skill-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-card);
        }

        .skill-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: var(--shadow-lg);
        }

        .skill-main {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .skill-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15));
          border: 1px solid rgba(59, 130, 246, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }

        .skill-name {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-main);
          margin-bottom: 2px;
        }

        .skill-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .skill-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-action {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--input-bg);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-edit:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
          color: var(--text-main);
        }

        .btn-delete {
          border-color: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #ffffff;
        }

        /* Empty State */
        .empty-state {
          background: var(--bg-card);
          border: 1px dashed var(--border-color);
          border-radius: 20px;
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

        /* Modal Overlay & Card */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 7, 18, 0.7);
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
          max-width: 500px;
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
          background: rgba(168, 85, 247, 0.1);
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

        .form-input, .form-select {
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

        .form-input:focus, .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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
      <div className="skills-header-bar">
        <div className="stats-summary">
          <div className="stat-badge">
            Total Skills: <strong>{skills.length}</strong>
          </div>
          {CATEGORIES.map((cat) => {
            const count = skills.filter((s) => s.category === cat).length;
            return (
              <div key={cat} className="stat-badge">
                {cat}: <strong>{count}</strong>
              </div>
            );
          })}
        </div>

        <button className="btn-primary" onClick={openAddModal}>
          <span>➕</span> Add New Skill
        </button>
      </div>

      {/* Controls Bar: Search & Category Filters */}
      <div className="controls-card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search skills by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-tabs">
          <button
            className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading skills...</h3>
          <p>Connecting to backend API...</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: "#fca5a5" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn-primary" style={{ margin: "16px auto 0 auto" }} onClick={fetchSkills}>
            🔄 Retry
          </button>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚡</div>
          <h3>No Skills Found</h3>
          <p>
            {searchTerm || selectedCategory !== "all"
              ? "No skills match your current search and filter settings."
              : "No skills have been added yet. Click 'Add New Skill' to create your first tech stack item!"}
          </p>
        </div>
      ) : (
        /* Display Skills grouped by category */
        Object.keys(groupedSkills).map((cat) => (
          <div key={cat} className="category-section">
            <h3 className="category-title">
              <span>⚡</span> {cat} ({groupedSkills[cat].length})
            </h3>
            <div className="skills-grid">
              {groupedSkills[cat].map((skill) => (
                <div key={skill.id} className="skill-card">
                  <div className="skill-left">
                    <div className="skill-icon-box">{skill.icon || "⚡"}</div>
                    <div className="skill-info">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-meta">
                        <span className="badge-category">{skill.category}</span>
                        <span className="sort-tag">Order: #{skill.sort_order ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => openEditModal(skill)}
                      title="Edit Skill"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => openDeleteModal(skill)}
                      title="Delete Skill"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* CREATE / EDIT FORM MODAL */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSkill ? "✏️ Edit Skill" : "➕ Add New Skill"}
              </h2>
              <button className="close-btn" onClick={() => setShowFormModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {/* Skill Name */}
                <div className="form-group">
                  <label className="form-label">Skill Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="e.g. React.js, Laravel, PostgreSQL"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.name && <div className="form-error">{formErrors.name[0]}</div>}
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && <div className="form-error">{formErrors.category[0]}</div>}
                </div>

                {/* Icon & Sort Order */}
                <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="form-label">Icon / Emoji</label>
                    <input
                      type="text"
                      name="icon"
                      className="form-input"
                      placeholder="e.g. ⚛️ or devicon-react"
                      value={formData.icon}
                      onChange={handleInputChange}
                    />
                    {formErrors.icon && <div className="form-error">{formErrors.icon[0]}</div>}
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
                    {formErrors.sort_order && <div className="form-error">{formErrors.sort_order[0]}</div>}
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
                  {submitting ? "Saving..." : editingSkill ? "Update Skill" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingSkill && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: "#f87171" }}>
                ⚠️ Delete Skill
              </h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 12px 0" }}>
                Are you sure you want to delete <strong>"{deletingSkill.name}"</strong>?
              </p>
              <p style={{ color: "#b8bee6", fontSize: "0.88rem", margin: 0 }}>
                This skill record will be permanently removed from your portfolio database.
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

export default AdminSkills;
