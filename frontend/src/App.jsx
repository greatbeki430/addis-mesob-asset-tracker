import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import GatePage from './pages/GatePage.jsx';
import OutsidePage from './pages/OutsidePage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import EmployeesPage from './pages/EmployeesPage.jsx';
import AssetsPage from './pages/AssetsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="gate" element={<GatePage />} />
          <Route path="outside" element={<OutsidePage />} />
          <Route path="history" element={<HistoryPage />} />

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
