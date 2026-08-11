import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import apiClient from "../utils/apiClient";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'unread', 'read'

  // Modals state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const showToastNotification = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try /api/admin/messages first, fallback to /api/admin/contacts if needed
      let res;
      try {
        res = await apiClient.get("/api/admin/messages");
      } catch {
        res = await apiClient.get("/api/admin/contacts");
      }

      if (res.data && res.data.status) {
        setMessages(res.data.data || []);
      } else {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to load messages. Please check your network connection or server.");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = async (msg) => {
    setSelectedMessage(msg);
    setShowDetailModal(true);

    // If message is unread, automatically mark it as read
    if (!msg.is_read) {
      try {
        await apiClient.patch(`/api/admin/messages/${msg.id}/read`, { is_read: true });
        setMessages((prev) =>
          prev.map((item) => (item.id === msg.id ? { ...item, is_read: true } : item))
        );
      } catch (err) {
        console.error("Failed to mark message as read:", err);
      }
    }
  };

  const toggleReadStatus = async (msg, e) => {
    if (e) e.stopPropagation();
    const newStatus = !msg.is_read;
    try {
      await apiClient.patch(`/api/admin/messages/${msg.id}/read`, { is_read: newStatus });
      setMessages((prev) =>
        prev.map((item) => (item.id === msg.id ? { ...item, is_read: newStatus } : item))
      );
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage((prev) => ({ ...prev, is_read: newStatus }));
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

  const openDeleteModal = (msg, e) => {
    if (e) e.stopPropagation();
    setDeletingMessage(msg);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMessage) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/admin/messages/${deletingMessage.id}`);
      showToastNotification("success", "Message deleted successfully!");
      if (selectedMessage && selectedMessage.id === deletingMessage.id) {
        setShowDetailModal(false);
        setSelectedMessage(null);
      }
      setShowDeleteModal(false);
      setDeletingMessage(null);
      fetchMessages();
    } catch (err) {
      console.error("Delete message error:", err);
      showToastNotification("error", "Failed to delete message.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(term) ||
      msg.email.toLowerCase().includes(term) ||
      (msg.subject && msg.subject.toLowerCase().includes(term)) ||
      msg.message.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "unread"
        ? !msg.is_read
        : msg.is_read;

    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const readCount = messages.length - unreadCount;

  return (
    <AdminLayout title="Messages & Contact Submissions">
      <style>{`
        /* Header bar */
        .msg-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .stats-summary {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .stat-badge {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .stat-badge strong {
          color: var(--text-main);
          margin-left: 6px;
        }

        .stat-badge.unread-alert {
          border-color: rgba(236, 72, 153, 0.4);
          background: rgba(236, 72, 153, 0.12);
          color: #f472b6;
        }

        .stat-badge.unread-alert strong {
          color: #f472b6;
        }

        /* Controls bar */
        .controls-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
          box-shadow: var(--shadow-card);
        }

        .search-wrapper {
          flex: 1;
          min-width: 240px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 10px;
          color: var(--text-main);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: #ec4899;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .filter-select {
          padding: 10px 16px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 10px;
          color: var(--text-main);
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
        }

        .filter-select option {
          background: var(--modal-bg);
          color: var(--text-main);
        }

        /* Message List / Cards */
        .msg-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .msg-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: var(--shadow-card);
          transition: all 0.25s ease;
          cursor: pointer;
          position: relative;
        }

        .msg-card.unread {
          border-color: rgba(236, 72, 153, 0.35);
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.06), rgba(13, 17, 38, 0.9));
        }

        .msg-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
          border-color: rgba(236, 72, 153, 0.4);
        }

        .msg-unread-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ec4899;
          box-shadow: 0 0 10px #ec4899;
          flex-shrink: 0;
        }

        .msg-main-info {
          flex: 1;
          overflow: hidden;
        }

        .msg-sender-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .msg-name {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-main);
        }

        .msg-email {
          font-size: 0.85rem;
          color: #ec4899;
          font-weight: 500;
        }

        .msg-subject {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .msg-snippet {
          font-size: 0.88rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .msg-right-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        .msg-date {
          font-size: 0.8rem;
          color: var(--text-dim);
          white-space: nowrap;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
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
          color: #3b82f6;
        }

        .btn-read-toggle:hover {
          background: rgba(59, 130, 246, 0.3);
          color: var(--text-main);
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #dc2626;
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
          max-width: 640px;
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
          background: rgba(236, 72, 153, 0.1);
        }

        .modal-body {
          padding: 24px;
        }

        .sender-box {
          background: var(--input-bg);
          border: 1px solid var(--border-color);
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
          color: var(--text-main);
        }

        .sender-email {
          color: #f472b6;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .msg-full-text {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 18px;
          color: var(--text-main);
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
      <div className="msg-header-bar">
        <div className="stats-summary">
          <div className="stat-badge">
            Total Messages: <strong>{messages.length}</strong>
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
            placeholder="Search messages by sender name, email, subject, or message content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading messages...</h3>
          <p>Connecting to backend API...</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="empty-icon">⚠️</div>
          <h3 style={{ color: "#fca5a5" }}>Error Loading Data</h3>
          <p>{error}</p>
          <button className="btn-primary" style={{ margin: "16px auto 0 auto" }} onClick={fetchMessages}>
            🔄 Retry
          </button>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✉️</div>
          <h3>No Messages Found</h3>
          <p>
            {searchTerm || statusFilter !== "all"
              ? "No contact submissions match your search and filter criteria."
              : "No contact messages received yet. Inbound inquiries will appear here!"}
          </p>
        </div>
      ) : (
        /* Message Cards List */
        <div className="msg-list">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`msg-card ${!msg.is_read ? "unread" : ""}`}
              onClick={() => openDetailModal(msg)}
            >
              {!msg.is_read && <div className="msg-unread-dot" title="Unread Message" />}

              <div className="msg-main-info">
                <div className="msg-sender-bar">
                  <span className="msg-name">{msg.name}</span>
                  <span className="msg-email">&lt;{msg.email}&gt;</span>
                </div>
                <div className="msg-subject">{msg.subject || "(No Subject)"}</div>
                <div className="msg-snippet">{msg.message}</div>
              </div>

              <div className="msg-right-info">
                <span className="msg-date">
                  📅 {new Date(msg.created_at).toLocaleDateString()}{" "}
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>

                <div className="action-buttons">
                  <button
                    className="btn-action btn-read-toggle"
                    onClick={(e) => toggleReadStatus(msg, e)}
                    title={msg.is_read ? "Mark as Unread" : "Mark as Read"}
                  >
                    {msg.is_read ? "✉️ Mark Unread" : "👁️ Mark Read"}
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={(e) => openDeleteModal(msg, e)}
                    title="Delete Message"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MESSAGE DETAILS MODAL */}
      {showDetailModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">✉️ Message Details</h2>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="sender-box">
                <div className="sender-row">
                  <span className="sender-name">{selectedMessage.name}</span>
                  <span className="msg-date">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="sender-email">✉️ {selectedMessage.email}</div>
                {selectedMessage.subject && (
                  <div style={{ color: "#ffffff", fontWeight: "600", marginTop: "10px", fontSize: "1rem" }}>
                    Subject: {selectedMessage.subject}
                  </div>
                )}
              </div>

              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#8c94c5", textTransform: "uppercase", marginBottom: "8px" }}>
                Message Content:
              </div>
              <div className="msg-full-text">{selectedMessage.message}</div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-action btn-read-toggle"
                onClick={() => toggleReadStatus(selectedMessage)}
              >
                {selectedMessage.is_read ? "✉️ Mark as Unread" : "👁️ Mark as Read"}
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn-action btn-delete"
                  style={{ padding: "10px 16px" }}
                  onClick={() => openDeleteModal(selectedMessage)}
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
      {showDeleteModal && deletingMessage && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-card" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ color: "#f87171" }}>
                ⚠️ Delete Message
              </h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ textAlign: "center" }}>
              <p style={{ color: "#ffffff", fontSize: "1.05rem", margin: "0 0 12px 0" }}>
                Are you sure you want to delete message from <strong>"{deletingMessage.name}"</strong>?
              </p>
              <p style={{ color: "#b8bee6", fontSize: "0.88rem", margin: 0 }}>
                This contact message will be permanently removed.
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

export default AdminMessages;
