const headerStyle = {
  display: 'grid',
  gridTemplateColumns: '200px 1fr 200px',
  alignItems: 'center',
  padding: '12px 16px',
  background: '#111827',
  color: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const tabButtonStyle = (active) => ({
  padding: '10px 14px',
  borderRadius: '12px',
  border: 'none',
  background: active ? '#2563eb' : '#1f2937',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '8px',
  fontWeight: 600,
  borderBottom: active ? '3px solid #60a5fa' : '3px solid transparent',
});

function DashboardHeader({ activeTab, onTabChange, user }) {
  const tabs = [
    { key: 'workspaces', label: 'Workspaces' },
    { key: 'routes', label: 'Routes' },
    { key: 'mappings', label: 'Mappings' },
  ];

  return (
    <header style={headerStyle}>
      <div style={{ fontWeight: 800, fontSize: '18px' }}>Slack Message Router</div>
      <div style={{ textAlign: 'center' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={tabButtonStyle(activeTab === tab.key)}
            onClick={() => onTabChange && onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'right', fontSize: '14px' }}>
        <div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
        <div style={{ fontSize: '12px', color: '#d1d5db' }}>{user?.email || 'Settings'}</div>
      </div>
    </header>
  );
}

export default DashboardHeader;
