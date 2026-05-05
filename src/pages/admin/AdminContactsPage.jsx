import { fetchContacts } from "@/api/contact";
import { formatApiError } from "@/api/errors";
import React, { useEffect, useState } from "react";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchContacts();
        // Sort by timestamp descending
        const sorted = [...data].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setContacts(sorted);
      } catch (err) {
        setError(formatApiError(err, "Failed to load messages."));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-4 p-xl-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Customer Messages</h1>
          <p className="text-secondary mb-0">
            Review inquiries and contact form submissions.
          </p>
        </div>
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="icon icon-error me-2"></i>
          <div>{error}</div>
        </div>
      )}

      <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-secondary">Date</th>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-secondary">Customer</th>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-secondary">Subject</th>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-secondary">Message</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    <span className="text-secondary">Loading messages...</span>
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-5">
                    <p className="mb-0 text-secondary">No messages found yet.</p>
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.contactId + c.timestamp}>
                    <td className="px-4 py-3">
                      <div className="fw-medium text-dark">
                        {new Date((c.timestamp || 0) * 1000).toLocaleDateString()}
                      </div>
                      <div className="small text-secondary">
                         {new Date((c.timestamp || 0) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-dark">{c.name}</div>
                      <div className="small text-secondary">{c.email || "No email"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                        {c.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="mb-0 text-dark small" style={{ maxWidth: 400, whiteSpace: 'pre-wrap' }}>
                        {c.message}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
