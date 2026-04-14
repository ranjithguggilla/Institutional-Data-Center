import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import Redirection from "./components/default/Redirection";
import "./App.css";

const LazyLogin = React.lazy(() => import("./components/default/Login"));
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
