import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './pages/DashboardLayout';
import OAuthCallback from './pages/OAuthCallback';

function Layout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

function SlackAuthRedirect() {
  useEffect(() => {
    window.location.href = '/auth/slack';
  }, []);
  return null;
}

function NotFound() {
  return <div style={{ padding: '20px' }}>404 - Page not found</div>;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: '20px' }}>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/auth/slack" element={<SlackAuthRedirect />} />
            <Route path="/slack/oauth/callback" element={<OAuthCallback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
