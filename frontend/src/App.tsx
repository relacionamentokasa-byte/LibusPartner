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
import { ForceChangePasswordPage } from './pages/ForceChangePassword';

// Alves Planejados sub-system
import { AlvesAuthProvider } from './context/AlvesAuthContext';
import { AlvesLayout } from './components/AlvesLayout';
import { VisaoGeralPage } from './pages/VisaoGeral';
import { ClientesPage } from './pages/Clientes';
import { PropostasListPage } from './pages/PropostasList';
import { CriadorPropostaPage } from './pages/CriadorProposta';
import { PreviaPropostaPage } from './pages/PreviaProposta';
import { PropostaPublicaPage } from './pages/PropostaPublica';
import { ContratosPage } from './pages/Contratos';
import { ConfiguracoesPage } from './pages/Configuracoes';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'GESTOR' | 'TECNICO'>;
}> = ({ children, allowedRoles }) => {
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

  if (user.mustChangePassword) {
    return <Navigate to="/force-change-password" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

const ForcePasswordRoute: React.FC = () => {
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

  if (!user.mustChangePassword) {
    return <Navigate to="/" replace />;
  }

  return <ForceChangePasswordPage />;
};

export function App() {
  return (
    <AuthProvider>
      <AlvesAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Libus Partner - Autenticação & Recuperação */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/force-change-password" element={<ForcePasswordRoute />} />

            {/* Libus Partner - Sistema Principal Protegido */}
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
                <ProtectedRoute allowedRoles={['ADMIN', 'GESTOR']}>
                  <UsersManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />

            {/* Alves Planejados - Subrotas isoladas */}
            <Route path="/p/:token" element={<PropostaPublicaPage />} />
            <Route path="/alves" element={<AlvesLayout><VisaoGeralPage /></AlvesLayout>} />
            <Route path="/alves/clientes" element={<AlvesLayout><ClientesPage /></AlvesLayout>} />
            <Route path="/alves/propostas" element={<AlvesLayout><PropostasListPage /></AlvesLayout>} />
            <Route path="/alves/propostas/nova" element={<AlvesLayout><CriadorPropostaPage /></AlvesLayout>} />
            <Route path="/alves/propostas/:id/editar" element={<AlvesLayout><CriadorPropostaPage /></AlvesLayout>} />
            <Route path="/alves/propostas/:id/previa" element={<AlvesLayout><PreviaPropostaPage /></AlvesLayout>} />
            <Route path="/alves/contratos" element={<AlvesLayout><ContratosPage /></AlvesLayout>} />
            <Route path="/alves/configuracoes" element={<AlvesLayout><ConfiguracoesPage /></AlvesLayout>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AlvesAuthProvider>
    </AuthProvider>
  );
}

export default App;
