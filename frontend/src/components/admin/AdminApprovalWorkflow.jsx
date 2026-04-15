import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

import AuthContext from "../auth/AuthContext";
import AdminTopBar from "./AdminTopBar";
import { API_BASE } from "../../apiBase";
import "../css/admin_home.css";

export default function AdminApprovalWorkflow() {
  const { jwtToken, logoutUser } = useContext(AuthContext);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [requests, setRequests] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState({
    entityType: "STUDENT",
    entityId: "",
    note: "",
  });

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, jwtToken]);

  async function fetchRequests() {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/admin/approvals`, {
        params: { status: statusFilter },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setRequests(response.data);
    } catch (error) {
      toast.error("Unable to load approval requests.");
      logoutUser();
    } finally {
      setLoading(false);
    }
  }

  async function fetchAuditTrail() {
    try {
      const response = await axios.get(`${API_BASE}/admin/audit-trail`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setAuditTrail(response.data || []);
    } catch (error) {
      toast.error("Unable to load audit trail.");
    }
  }

  async function handleCreateRequest(e) {
    e.preventDefault();
    if (!createForm.entityId.trim()) {
      toast.error("Entity ID is required.");
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(
        `${API_BASE}/admin/approvals/request`,
        createForm,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      toast.success("Approval request created.");
      setCreateForm({ entityType: "STUDENT", entityId: "", note: "" });
      await fetchRequests();
      await fetchAuditTrail();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to create approval request.";
      toast.error(typeof message === "string" ? message : "Unable to create approval request.");
    } finally {
      setSubmitting(false);
    }
  }

  async function reviewRequest(requestId, status) {
    try {
      setSubmitting(true);
      await axios.put(
        `${API_BASE}/admin/approvals/${requestId}/review`,
        { status, note: `${status} by admin` },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      toast.success(`Request ${status.toLowerCase()}.`);
      await fetchRequests();
      await fetchAuditTrail();
    } catch (error) {
      toast.error("Unable to update approval status.");
    } finally {
      setSubmitting(false);
    }
  }

  validateAdmin(jwtToken, logoutUser);

  useEffect(() => {
    fetchAuditTrail();
  }, [jwtToken]);

  return (
    <div className="container-fluid">
      <AdminTopBar />
      <div className="body-part pb-5 mt-3">
        <div className="row pt-4 g-3">
          <div className="col-lg-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="mb-3">Create Approval Request</h5>
                <form onSubmit={handleCreateRequest}>
                  <div className="mb-2">
                    <label className="form-label">Entity Type</label>
                    <select
                      className="form-select"
                      value={createForm.entityType}
                      onChange={(e) =>
                        setCreateForm((prev) => ({ ...prev, entityType: e.target.value }))
                      }
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="FACULTY">FACULTY</option>
                      <option value="USER">USER</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Entity ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={createForm.entityId}
                      onChange={(e) =>
                        setCreateForm((prev) => ({ ...prev, entityId: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Note</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={createForm.note}
                      onChange={(e) =>
                        setCreateForm((prev) => ({ ...prev, note: e.target.value }))
                      }
                    />
                  </div>
                  <button type="submit" className="btn btn-danger" disabled={submitting}>
                    {submitting ? "Submitting..." : "Create Request"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Approval Workflow</h5>
                  <select
                    className="form-select w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                {loading ? (
                  <p className="text-muted">Loading requests...</p>
                ) : requests.length === 0 ? (
                  <p className="text-muted mb-0">No approval requests found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Entity</th>
                          <th>Status</th>
                          <th>Requested By</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                              {item.entityType} / {item.entityId}
                            </td>
                            <td>{item.status}</td>
                            <td>{item.requestedBy}</td>
                            <td>{item.createdAt?.replace("T", " ").slice(0, 16)}</td>
                            <td>
                              {item.status === "PENDING" ? (
                                <div className="d-flex gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => reviewRequest(item.id, "APPROVED")}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => reviewRequest(item.id, "REJECTED")}
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted">Reviewed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="card shadow mt-3">
              <div className="card-body">
                <h5 className="mb-3">Audit Timeline</h5>
                {auditTrail.length === 0 ? (
                  <p className="text-muted mb-0">No audit events found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>When</th>
                          <th>Entity</th>
                          <th>Action</th>
                          <th>By</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditTrail.map((item) => (
                          <tr key={item.id}>
                            <td>{item.createdAt?.replace("T", " ").slice(0, 16)}</td>
                            <td>
                              {item.entityType} / {item.entityId}
                            </td>
                            <td>{item.actionType}</td>
                            <td>{item.performedBy}</td>
                            <td>{item.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function validateAdmin(jwtToken, logoutUser) {
  if (!jwtToken) {
    return <Navigate to="/login" />;
  }
  const username = jwtDecode(jwtToken).sub;
  const allowedAdmins = new Set(["admin", "admin@idc.com"]);
  if (!allowedAdmins.has(username)) {
    logoutUser();
  }
}
