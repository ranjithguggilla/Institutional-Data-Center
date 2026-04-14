import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

import AuthContext from "../auth/AuthContext";
import AdminTopBar from "./AdminTopBar";
import { API_BASE } from "../../apiBase";
import "../css/admin_home.css";

export default function AdminUserManagement() {
  const { jwtToken, logoutUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [updatingUser, setUpdatingUser] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [jwtToken]);

  async function fetchUsers() {
    try {
      const response = await axios.get(`${API_BASE}/user/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Unable to load users.");
      logoutUser();
    }
  }

  async function handleRoleChange(userName, role) {
    try {
      setUpdatingUser(userName);
      await axios.put(
        `${API_BASE}/user/role/${encodeURIComponent(userName)}`,
        { role },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) => (user.userName === userName ? { ...user, role } : user))
      );
      toast.success(`Role updated for ${userName}.`);
    } catch (error) {
      toast.error("Failed to update role.");
    } finally {
      setUpdatingUser("");
    }
  }

  async function handleDelete(userName) {
    if (!window.confirm(`Delete user ${userName}?`)) {
      return;
    }
    try {
      await axios.delete(`${API_BASE}/user/${encodeURIComponent(userName)}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setUsers((prev) => prev.filter((u) => u.userName !== userName));
      toast.success(`User ${userName} deleted.`);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to delete user.";
      toast.error(typeof message === "string" ? message : "Unable to delete user.");
    }
  }

  validateAdmin(jwtToken, logoutUser);

  return (
    <div className="container-fluid">
      <AdminTopBar />
      <div className="body-part pb-5 mt-3">
        <div className="row pt-4">
          <div className="col-xl-10 col-lg-11 mx-auto">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="mb-3">User & Role Management</h4>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Role</th>
                        <th style={{ width: "220px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center text-muted">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.userName}>
                            <td>{user.userName}</td>
                            <td>{user.role}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <select
                                  className="form-select form-select-sm"
                                  value={user.role}
                                  disabled={updatingUser === user.userName}
                                  onChange={(e) =>
                                    handleRoleChange(user.userName, e.target.value)
                                  }
                                >
                                  <option value="ADMIN">ADMIN</option>
                                  <option value="STUDENT">STUDENT</option>
                                  <option value="FACULTY">FACULTY</option>
                                </select>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(user.userName)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
