import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TouristDashboard from './pages/TouristDashboard';
import MapTrackingPage from './pages/MapTrackingPage';
import IncidentReporting from './pages/IncidentReporting';
import SOSEmergency from './pages/SOSEmergency';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const HomeRoute = () => {
  const { token, isAdmin } = useContext(AuthContext);
  if (!token) return <LandingPage />;
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="theme-shell min-h-screen" data-theme="light">
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <TouristDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <PrivateRoute>
                    <MapTrackingPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/report-incident"
                element={
                  <PrivateRoute>
                    <IncidentReporting />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sos"
                element={
                  <PrivateRoute>
                    <SOSEmergency />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={['ADMIN']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<HomeRoute />} />
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
