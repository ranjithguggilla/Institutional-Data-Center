import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthProvider } from "./components/auth/AuthContext";
import Redirection from "./components/default/Redirection";
import "./App.css";

/** One Helmet for auth routes so the tab title always matches the URL (avoids stale Register title on /login). */
function AuthRouteHead() {
  const { pathname } = useLocation();
  if (pathname === "/login") {
    return (
      <Helmet>
        <title>Login — Institutional Data Center</title>
        <body className="bg-white" />
      </Helmet>
    );
  }
  if (pathname === "/register") {
    return (
      <Helmet>
        <title>Register — Institutional Data Center</title>
        <body className="bg-white" />
      </Helmet>
    );
  }
  if (pathname === "/forgot-password") {
    return (
      <Helmet>
        <title>Forgot password — Institutional Data Center</title>
        <body className="bg-white" />
      </Helmet>
    );
  }
  return null;
}

const LazyLogin = React.lazy(() => import("./components/default/Login"));
const LazyRegister = React.lazy(() => import("./components/default/Register"));
const LazyForgotPassword = React.lazy(() =>
  import("./components/default/ForgotPassword")
);
const LazyStudentHome = React.lazy(() =>
  import("./components/student/StudentHome")
);
const LazyFacultyHome = React.lazy(() =>
  import("./components/faculty/FacultyHome")
);
const LazyHodStudentView = React.lazy(() =>
  import("./components/faculty/HodStudentView")
);
const LazyAdminHome = React.lazy(() => import("./components/admin/AdminHome"));
const LazyAdminUserManagement = React.lazy(() =>
  import("./components/admin/AdminUserManagement")
);
const LazyAdminAnalytics = React.lazy(() =>
  import("./components/admin/AdminAnalyticsDashboard")
);
const LazyAdminApprovals = React.lazy(() =>
  import("./components/admin/AdminApprovalWorkflow")
);
const LazyWatchStudent = React.lazy(() =>
  import("./components/admin/WatchStudent")
);
const LazyWatchFaculty = React.lazy(() =>
  import("./components/admin/WatchFaculty")
);
const LazyFacultyAdminHome = React.lazy(() =>
  import("./components/admin/FacultyAdminHome")
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthRouteHead />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Redirection />} />
            <Route
              path="/login"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyLogin />
                </Suspense>
              }
            />
            <Route
              path="/register"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyRegister />
                </Suspense>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyForgotPassword />
                </Suspense>
              }
            />
            <Route
              path="/student"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyStudentHome />
                </Suspense>
              }
            />
            <Route
              path="/faculty"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyFacultyHome />
                </Suspense>
              }
            />
            <Route
              path="/faculty/:studentId"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyHodStudentView />
                </Suspense>
              }
            />
            <Route
              path="/admin/student"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyAdminHome />
                </Suspense>
              }
            />
            <Route
              path="/admin/faculty"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyFacultyAdminHome />
                </Suspense>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyAdminUserManagement />
                </Suspense>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyAdminAnalytics />
                </Suspense>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyAdminApprovals />
                </Suspense>
              }
            />
            <Route
              path="/admin/student/:studentId"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyWatchStudent />
                </Suspense>
              }
            />
            <Route
              path="/admin/faculty/:facultyId"
              element={
                <Suspense
                  fallback={
                    <div className="spinner-container">
                      <div className="spinner-border" role="status"></div>
                    </div>
                  }
                >
                  <LazyWatchFaculty />
                </Suspense>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
