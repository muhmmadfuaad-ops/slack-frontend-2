import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: '12px',
  background: '#f3f4f6',
};

const cardStyle = {
  background: '#fff',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  minWidth: '320px',
  textAlign: 'center',
};

const buttonStyle = {
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #2563eb',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const status = params.get('status');
  const teamId = params.get('team_id');
  const error = params.get('error');

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => navigate('/dashboard'), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [status, navigate]);

  if (!status && !error) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Processing...</div>
          <div style={{ color: '#6b7280' }}>Please wait while we complete the connection.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', color: '#b91c1c' }}>Error</div>
          <div style={{ color: '#6b7280', marginBottom: '12px' }}>{error}</div>
          <button style={buttonStyle} onClick={() => navigate('/connect')}>Try Again</button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', color: '#15803d' }}>
            Workspace connected successfully!
          </div>
          {teamId && <div style={{ color: '#6b7280', marginBottom: '12px' }}>Team ID: {teamId}</div>}
          <button style={buttonStyle} onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return null;
}

export default OAuthCallback;
