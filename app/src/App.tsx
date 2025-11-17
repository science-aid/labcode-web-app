// import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ProtocolListPage } from './pages/ProtocolListPage';
import { ProtocolDetailPage } from './pages/ProtocolDetailPage';
import { ProcessViewPage } from './pages/ProcessViewPage'; // ★新規インポート
import NotFound from './pages/NotFound';
import InternalServerError from './pages/InternalServerError';
import Forbidden from './pages/Forbidden';

// Redirect component for backward compatibility
const RedirectToNewProcessesRoute = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/runs/${id}/processes`} replace />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/protocol_list" element={<ProtocolListPage />} />
            <Route path="/protocol_list/:id" element={<ProtocolDetailPage />} />
            {/* Redirect old URL pattern to new RESTful route for backward compatibility */}
            <Route path="/protocol_list/:id/processes" element={<RedirectToNewProcessesRoute />} />
            <Route path="/runs/:runId/processes" element={<ProcessViewPage />} /> {/* ★RESTful準拠に変更 */}
            <Route path="/not_found" element={<NotFound />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/internal_server_error" element={<InternalServerError />} />
            <Route path="*" element={<Navigate to="/not_found" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;