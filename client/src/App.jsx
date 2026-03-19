import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

import LoginPage          from './pages/LoginPage';
import SignupPage         from './pages/SignupPage';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage      from './pages/DashboardPage';
import SubscriptionsPage  from './pages/SubscriptionsPage';
import AlertsPage         from './pages/AlertsPage';
import ProfilePage        from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15,10,30,0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(99,102,241,0.3)',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
        <Routes>

          {/* Public routes */}
          <Route path="/"                element={<Navigate to="/login" />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/signup"          element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes — all share Layout (sidebar + topbar) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard"     element={<DashboardPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/alerts"        element={<AlertsPage />} />
              <Route path="/profile"       element={<ProfilePage />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;