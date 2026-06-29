import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { default as AccessControlCreatePage } from './pages/AccessControlCreatePage';
import AccessControlLoginPage from './pages/AccessControlLoginPage';
import AccessControlProfilePage from './pages/AccessControlProfilePage';
import AccessControlSelectedUserPage from './pages/AccessControlSelectedUserPage';
import { default as AccessControlTablePage } from './pages/AccessControlTablePage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminTokenResetPage from './pages/AdminTokenResetPage';
import AssociateCreatePage from './pages/AssociateCreatePage';
import AssociateLoginPage from './pages/AssociateLoginPage';
import AssociateProfilePage from './pages/AssociateProfilePage';
import AssociatesTablePage from './pages/AssociatesTablePage';
import ComingSoonPage from './pages/ComingSoonPage';
import CommunicationPage from './pages/CommunicationPage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/LandingPage';
import LandingValidatePage from './pages/LandingValidatePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';
import TokenPage from './pages/TokenPage';
import PrivateRoute from './routes/PrivateRoute';
import AssociateSelfSupplementPage from './pages/AssociateSelfSupplementPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/validate" element={<LandingValidatePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/insert-token" element={<AdminTokenResetPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/login-associado" element={<AssociateLoginPage />} />
          <Route path="/token-associado" element={<TokenPage />} />

          <Route path="/login-controle" element={<AccessControlLoginPage />} />

          {/* Privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Controle de acesso */}
            <Route
              path="/controle-de-acesso"
              element={<AccessControlTablePage />}
            />
            <Route
              path="/controle-de-acesso/novo"
              element={<AccessControlCreatePage />}
            />
            <Route
              path="/controle-de-acesso/:id"
              element={<AccessControlSelectedUserPage />}
            />
            <Route
              path="/controle-de-acesso/meu-perfil"
              element={<AccessControlProfilePage />}
            />

            {/* Associados */}
            <Route path="/associados" element={<AssociatesTablePage />} />
            <Route path="/associados/novo" element={<AssociateCreatePage />} />
            <Route path="/associados/:id" element={<AssociateProfilePage />} />

            {/* Meu cadastro (associado) */}
            <Route path="/meu-cadastro" element={<AssociateSelfSupplementPage />} />

            {/* Comunicação */}
            <Route path="/comunicacao" element={<CommunicationPage />} />

            {/* Configurações */}
            <Route path="/configuracoes" element={<SettingsPage />} />

            {/* Meu Perfil (admin) */}
            <Route path="/meu-perfil" element={<AdminProfilePage />} />

            {/* Placeholders */}
            <Route path="/settings" element={<ComingSoonPage />} />
            <Route path="/reports" element={<ComingSoonPage />} />
            <Route path="/users" element={<ComingSoonPage />} />
            <Route path="/membership-card" element={<ComingSoonPage />} />
          </Route>

          {/* Não implementadas */}
          <Route path="/futura" element={<ComingSoonPage />} />

          {/* Inexistentes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
