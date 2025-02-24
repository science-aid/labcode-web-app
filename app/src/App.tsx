// import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ProtocolListPage } from './pages/ProtocolListPage';
import { ProtocolDetailPage } from './pages/ProtocolDetailPage';
import { ProtocolListTestPage } from './pages/ProtocolListTestPage';
import NotFound from './pages/NotFound';
import InternalServerError from './pages/InternalServerError';
import Forbidden from './pages/Forbidden';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/protocol_list" element={<ProtocolListPage />} />
            <Route path="/protocol_list_test" element={<ProtocolListTestPage />} />
            <Route path="/protocols/:id" element={<ProtocolDetailPage />} />
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