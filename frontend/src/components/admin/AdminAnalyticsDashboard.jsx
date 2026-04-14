import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

import AuthContext from "../auth/AuthContext";
import AdminTopBar from "./AdminTopBar";
import { API_BASE } from "../../apiBase";
import "../css/admin_home.css";

export default function AdminAnalyticsDashboard() {
  const { jwtToken, logoutUser } = useContext(AuthContext);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, [jwtToken]);

  async function fetchOverview() {
    try {
      const response = await axios.get(`${API_BASE}/admin/analytics/overview`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setOverview(response.data);
    } catch (error) {
      toast.error("Unable to load analytics.");
      logoutUser();
    }
  }

  validateAdmin(jwtToken, logoutUser);

  return (
    <div className="container-fluid">
      <AdminTopBar />
      <div className="body-part pb-5 mt-3">
        <div className="row pt-4">
          <div className="col-xl-11 mx-auto">
            <h4 className="mb-3">Analytics Dashboard</h4>
            {!overview ? (
              <p className="text-muted">Loading analytics...</p>
            ) : (
              <>
                <div className="row g-3">
                  <StatCard title="Students" value={overview.studentCount} />
                  <StatCard title="Faculty" value={overview.facultyCount} />
                  <StatCard title="Users" value={overview.userCount} />
                  <StatCard title="Pending Approvals" value={overview.pendingApprovals} />
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-lg-4">
                    <AnalyticsTable
                      title="Users by Role"
                      rows={overview.usersByRole}
                      emptyLabel="No role data"
                    />
                  </div>
                  <div className="col-lg-4">
                    <AnalyticsTable
                      title="Students by Department"
                      rows={overview.studentsByDepartment}
                      emptyLabel="No student data"
                    />
                  </div>
                  <div className="col-lg-4">
                    <AnalyticsTable
                      title="Faculty by Department"
                      rows={overview.facultyByDepartment}
                      emptyLabel="No faculty data"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="col-lg-3 col-md-6">
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="text-muted mb-1">{title}</p>
          <h3 className="mb-0">{value ?? 0}</h3>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTable({ title, rows, emptyLabel }) {
  const entries = rows ? Object.entries(rows) : [];
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h6 className="mb-3">{title}</h6>
        {entries.length === 0 ? (
          <p className="text-muted mb-0">{emptyLabel}</p>
        ) : (
          <ul className="list-group list-group-flush">
            {entries.map(([key, value]) => (
              <li
                key={key}
                className="list-group-item d-flex justify-content-between px-0"
              >
                <span>{key}</span>
                <b>{value}</b>
              </li>
            ))}
          </ul>
        )}
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
