import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import apiClient from "../utils/apiClient";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'unread', 'read'

  // Modals state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingContact, setDeletingContact] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const showToastNotification = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      try {
        res = await apiClient.get("/api/admin/contacts");
      } catch {
        res = await apiClient.get("/api/admin/messages");
      }

      if (res.data && res.data.status) {
        setContacts(res.data.data || []);
      } else {
        setContacts(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch contact submissions:", err);
      setError("Failed to load contact submissions. Please check your server connection.");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = async (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);

    // If contact submission is unread, automatically mark it as read
    if (!contact.is_read) {
      try {
        await apiClient.patch(`/api/admin/contacts/${contact.id}/read`, { is_read: true });
        setContacts((prev) =>
          prev.map((item) => (item.id === contact.id ? { ...item, is_read: true } : item))
        );
      } catch (err) {
        console.error("Failed to mark message as read:", err);
      }
    }
  };

  const toggleReadStatus = async (contact, e) => {
    if (e) e.stopPropagation();
    const newStatus = !contact.is_read;
    try {
      await apiClient.patch(`/api/admin/contacts/${contact.id}/read`, { is_read: newStatus });
      setContacts((prev) =>
        prev.map((item) => (item.id === contact.id ? { ...item, is_read: newStatus } : item))
      );
      if (selectedContact && selectedContact.id === contact.id) {
        setSelectedContact((prev) => ({ ...prev, is_read: newStatus }));
      }
      showToastNotification(
        "success",
        newStatus ? "Marked as read." : "Marked as unread."
      );
    } catch (err) {
      console.error("Failed to toggle read status:", err);
      showToastNotification("error", "Failed to update read status.");
    }
  };

  const openDeleteModal = (contact, e) => {
    if (e) e.stopPropagation();
    setDeletingContact(contact);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingContact) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/contacts/${deletingContact.id}`);
      showToastNotification("success", "Contact submission deleted successfully!");
      if (selectedContact && selectedContact.id === deletingContact.id) {
        setShowDetailModal(false);
        setSelectedContact(null);
      }
      setShowDeleteModal(false);
      setDeletingContact(null);
      fetchContacts();
    } catch (err) {
      console.error("Delete contact error:", err);
      showToastNotification("error", "Failed to delete contact submission.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      (contact.subject && contact.subject.toLowerCase().includes(term)) ||
      contact.message.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "unread"
        ? !contact.is_read
        : contact.is_read;

    return matchesSearch && matchesStatus;
  });

  const unreadCount = contacts.filter((c) => !c.is_read).length;
  const readCount = contacts.length - unreadCount;

  return (
    <AdminLayout title="Contact Submissions">
      <style>{`
        /* Header bar */
        .contact-header-bar {
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

        .stat-badge.unread-alert {
          border-color: rgba(236, 72, 153, 0.45);
          background: rgba(236, 72, 153, 0.14);
          color: #f472b6;
        }

        .stat-badge.unread-alert strong {
          color: #f472b6;
        }

        /* Controls bar */
        .controls-card {
          background: rgba(13, 17, 38, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 18px 22px;
          margin-bottom: 28px;
          display: flex;
          gap: 18px;
          align-items: center;
          flex-wrap: wrap;
          backdrop-filter: blur(12px);
        }

        .search-wrapper {
          flex: 1;
          min-width: 260px;
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
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.18);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1rem;
        }

        .filter-select {
          padding: 12px 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #fff;
          font-size: 0.92rem;
          outline: none;
          cursor: pointer;
        }

        .filter-select option {
          background: #0d1126;
          color: #fff;
        }

        /* Contact Cards List */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-card {
          background: rgba(13, 17, 38, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          padding: 22px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
        }

        .contact-card.unread {
          border-color: rgba(236, 72, 153, 0.4);
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(13, 17, 38, 0.9));
        }

        .contact-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.4);
          border-color: rgba(236, 72, 153, 0.45);
        }

        .contact-unread-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #ec4899;
          box-shadow: 0 0 12px #ec4899;
          flex-shrink: 0;
        }

        .contact-main-info {
          flex: 1;
          overflow: hidden;
        }

        .contact-sender-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .contact-name {
          font-weight: 800;
          font-size: 1.1rem;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .contact-email {
          font-size: 0.88rem;
          color: #f472b6;
          font-weight: 600;
        }

        .contact-subject {
          font-size: 0.96rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .contact-snippet {
          font-size: 0.9rem;
          color: #cbd5e1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .contact-right-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          flex-shrink: 0;
        }

        .contact-date {
          font-size: 0.82rem;
          font-weight: 500;
          color: #94a3b8;
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-read-toggle {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #93c5fd;
        }

        .btn-read-toggle:hover {
          background: rgba(59, 130, 246, 0.3);
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
          max-width: 640px;
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

        .sender-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .sender-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .sender-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .sender-email {
          color: #f472b6;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .contact-full-text {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 18px;
          color: #e5e7eb;
          font-size: 0.95rem;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 300px;
          overflow-y: auto;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
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
      <div className="contact-header-bar">
        <div className="stats-summary">
          <div className="stat-badge">
            Total Submissions: <strong>{contacts.length}</strong>
          </div>
          <div className={`stat-badge ${unreadCount > 0 ? "unread-alert" : ""}`}>
            Unread: <strong>{unreadCount}</strong>
          </div>
          <div className="stat-badge">
            Read: <strong>{readCount}</strong>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="controls-card">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by sender name, email, subject, or message content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Submissions</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading contact submissions...</h3>
          <p>Connecting to backend API...</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: "#fca5a5" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn-primary" style={{ margin: "16px auto 0 auto" }} onClick={fetchContacts}>
            🔄 Retry
          </button>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✉️</div>
          <h3>No Submissions Found</h3>
          <p>
            {searchTerm || statusFilter !== "all"
              ? "No contact submissions match your search and filter criteria."
              : "No contact submissions received yet. Inbound inquiries will appear here!"}
          </p>
        </div>
      ) : (
        /* Contact Cards List */
        <div className="contact-list">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-card ${!contact.is_read ? "unread" : ""}`}
              onClick={() => openDetailModal(contact)}
            >
              {!contact.is_read && <div className="contact-unread-dot" title="Unread Submission" />}

              <div className="contact-main-info">
                <div className="contact-sender-bar">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-email">&lt;{contact.email}&gt;</span>
                </div>
                <div className="contact-subject">{contact.subject || "(No Subject)"}</div>
                <div className="contact-snippet">{contact.message}</div>
              </div>

              <div className="contact-right-info">
                <span className="contact-date">
                  📅 {new Date(contact.created_at).toLocaleDateString()}{" "}
                  {new Date(contact.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>

                <div className="action-buttons">
                  <button
                    className="btn-action btn-read-toggle"
                    onClick={(e) => toggleReadStatus(contact, e)}
                    title={contact.is_read ? "Mark as Unread" : "Mark as Read"}
                  >
                    {contact.is_read ? "✉️ Mark Unread" : "👁️ Mark Read"}
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={(e) => openDeleteModal(contact, e)}
                    title="Delete Submission"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW CONTACT DETAILS MODAL */}
      {showDetailModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">✉️ Submission Details</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="sender-box">
                <div className="sender-row">
                  <span className="sender-name">{selectedContact.name}</span>
                  <span className="contact-date">
                    {new Date(selectedContact.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="sender-email">✉️ {selectedContact.email}</div>
                {selectedContact.subject && (
                  <div style={{ color: "#ffffff", fontWeight: "600", marginTop: "10px", fontSize: "1rem" }}>
                    Subject: {selectedContact.subject}
                  </div>
                )}
              </div>

              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8c94c5", textTransform: "uppercase", marginBottom: "8px" }}>
                Message Content:
              </div>
              <div className="contact-full-text">{selectedContact.message}</div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-action btn-read-toggle"
                onClick={() => toggleReadStatus(selectedContact)}
              >
                {selectedContact.is_read ? "✉️ Mark as Unread" : "👁️ Mark as Read"}
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn-action btn-delete"
                  style={{ padding: "10px 16px" }}
                  onClick={() => openDeleteModal(selectedContact)}
                >
                  🗑️ Delete
                </button>
                <button className="btn-cancel" onClick={() => setShowDetailModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && deletingContact && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: "#f87171" }}>
                ⚠️ Delete Submission
              </h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 12px 0" }}>
                Are you sure you want to delete submission from <strong>"{deletingContact.name}"</strong>?
              </p>
              <p style={{ color: "#b8bee6", fontSize: "0.88rem", margin: 0 }}>
                This submission record will be permanently removed.
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

export default AdminContact;
