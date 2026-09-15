import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { CatalogPage } from './pages/Catalog';
import { CompaniesPage } from './pages/Companies';
import { EvaluationsListPage } from './pages/EvaluationsList';
import { NewEvaluationWizard } from './pages/NewEvaluation';
import { EvaluationExecutionPage } from './pages/EvaluationExecution';
import { EvaluationReportPage } from './pages/EvaluationReport';
import { UsersManagementPage } from './pages/UsersManagement';
import { AuditLogsPage } from './pages/AuditLogs';
import { ProfilePage } from './pages/Profile';
import { ResetPasswordPage } from './pages/ResetPassword';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        Carregando Libus Partner...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <CompaniesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations"
            element={
              <ProtectedRoute>
                <EvaluationsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations/new"
            element={
              <ProtectedRoute>
                <NewEvaluationWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations/:id"
            element={
              <ProtectedRoute>
                <EvaluationExecutionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations/:id/report"
            element={
              <ProtectedRoute>
                <EvaluationReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
