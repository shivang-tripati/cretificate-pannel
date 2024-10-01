import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/login";
import DashboardPage from "./pages/admin/DashboardPage";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./pages/auth/protected-route";
import CertificateVerificationPage from "./pages/user/CertificateVerification";
import HomePage from "./components/ui/HomePage";

const App: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <Router>
        {!isAuthenticated && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Home page route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/verify-certificate" element={<VerificationPage />} /> */}
          <Route
            path="/verify/:certificateId"
            element={<CertificateVerificationPage />}
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
