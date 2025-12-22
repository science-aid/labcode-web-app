// import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StorageProvider } from './contexts/StorageContext';
import { LoginPage } from './pages/LoginPage';
import { RunListPage } from './pages/RunListPage';
import { RunDetailPage } from './pages/RunDetailPage';
import { ProcessViewPage } from './pages/ProcessViewPage'; // ★新規インポート
import { OperationListPage } from './pages/OperationListPage';
import NotFound from './pages/NotFound';
import InternalServerError from './pages/InternalServerError';
import Forbidden from './pages/Forbidden';

// Redirect components for backward compatibility
const RedirectToNewProcessesRoute = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/runs/${id}/processes`} replace />;
};

const RedirectToRuns = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <Navigate to={`/runs/${id}`} replace /> : <Navigate to="/runs" replace />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <StorageProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* Main routes - RESTful design */}
            <Route path="/runs" element={<RunListPage />} />
            <Route path="/runs/:id" element={<RunDetailPage />} />
            <Route path="/runs/:runId/processes" element={<ProcessViewPage />} />
            <Route path="/operations" element={<OperationListPage />} />
            {/* Redirect old URL patterns for backward compatibility */}
            <Route path="/protocol_list" element={<RedirectToRuns />} />
            <Route path="/protocol_list/:id" element={<RedirectToRuns />} />
            <Route path="/protocol_list/:id/processes" element={<RedirectToNewProcessesRoute />} />
            {/* Error pages */}
            <Route path="/not_found" element={<NotFound />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/internal_server_error" element={<InternalServerError />} />
            <Route path="*" element={<Navigate to="/not_found" replace />} />
          </Routes>
          </StorageProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;