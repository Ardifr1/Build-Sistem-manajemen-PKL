import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/dashboard admin/dashboard-admin.jsx";
import Login from "./pages/auth/login.jsx";
import { authApi } from "./api/index.js";

/** Rute yang butuh login — lempar ke /login kalau belum ada token. */
function ProtectedRoute({ children }) {
  const user = authApi.currentUser();
  const token = (() => {
    try {
      return localStorage.getItem("simagang_token");
    } catch {
      return null;
    }
  })();
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/** Kalau sudah login, /login dialihkan ke dashboard. */
function GuestRoute({ children }) {
  const user = authApi.currentUser();
  let token = null;
  try {
    token = localStorage.getItem("simagang_token");
  } catch {
    /* abaikan */
  }
  if (user && token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
