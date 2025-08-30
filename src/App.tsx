import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import EmployeePage from './pages/EmployeePage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeePage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={user?.role === 'admin' ? '/admin' : '/employee'}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;