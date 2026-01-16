import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getWorkspaces,
  getRoutes,
  getIdentityMappings,
  getChannels,
} from '../utils/api';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '300px 1fr 300px',
  gap: '16px',
  minHeight: '100vh',
  padding: '16px',
  background: '#f5f7fb',
};

const panelStyle = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  padding: '16px',
  overflow: 'auto',
};

const tabButtonStyle = (active) => ({
  padding: '10px 14px',
  borderRadius: '10px',
  border: 'none',
  background: active ? '#111827' : '#e5e7eb',
  color: active ? '#fff' : '#111827',
  cursor: 'pointer',
});

function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [identityMappings, setIdentityMappings] = useState([]);
  const [activeTab, setActiveTab] = useState('workspaces');
  const [editingRoute, setEditingRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ws, rts, mappings] = await Promise.all([
          getWorkspaces(),
          getRoutes(),
          getIdentityMappings(),
        ]);
        setWorkspaces(ws || []);
        setRoutes(rts || []);
        setIdentityMappings(mappings || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, []);

  const handleWorkspaceClick = async (workspace) => {
    setSelectedWorkspace(workspace);
    setChannels([]);
    setLoading(true);
    setError(null);
    try {
      const data = await getChannels(workspace.team_id);
      setChannels(data || []);
      setActiveTab('workspaces');
    } catch (err) {
      console.error(err);
      setError('Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const renderWorkspacesList = () => (
    <div>
      <h3>Workspaces</h3>
      {workspaces.map((ws) => (
        <div
          key={ws.team_id}
          onClick={() => handleWorkspaceClick(ws)}
          style={{
            padding: '10px',
            marginBottom: '8px',
            borderRadius: '10px',
            border: ws.team_id === selectedWorkspace?.team_id ? '2px solid #111827' : '1px solid #e5e7eb',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {ws.is_internal ? '🟢' : '🟡'} {ws.team_name || ws.team_id}
            </span>
            {ws.is_internal && <span title="Internal workspace">🏠 INTERNAL</span>}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Connected: {ws.connected_at}</div>
        </div>
      ))}
    </div>
  );

  const renderRoutesList = () => (
    <div>
      <h3>Routes</h3>
      {routes.map((route) => (
        <div
          key={route.route_id}
          onClick={() => setEditingRoute(route)}
          style={{
            padding: '10px',
            marginBottom: '8px',
            borderRadius: '10px',
            border: route.route_id === editingRoute?.route_id ? '2px solid #111827' : '1px solid #e5e7eb',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <strong>{route.source_team_name || route.source_team_id}</strong>
            <span>{route.direction === 'bidirectional' ? '↔' : '→'}</span>
            <strong>{route.dest_team_name || route.dest_team_id}</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {route.source_channel_id} → {route.dest_channel_id} • {route.direction}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMappingsList = () => (
    <div>
      <h3>Identity Mappings</h3>
      {identityMappings.map((mapping) => (
        <div
          key={mapping.key}
          style={{
            padding: '10px',
            marginBottom: '8px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{mapping.internal_username} → {mapping.client_username}</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{mapping.client_team_name || mapping.client_team_id}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{mapping.internal_user_id} → {mapping.client_user_id}</div>
        </div>
      ))}
    </div>
  );

  const renderRightPanel = () => {
    if (editingRoute) {
      return (
        <div>
          <h3>Edit Route</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div><strong>Name:</strong> {editingRoute.name || 'Untitled Route'}</div>
            <div><strong>Direction:</strong> {editingRoute.direction}</div>
            <div><strong>Source:</strong> {editingRoute.source_team_name || editingRoute.source_team_id} / {editingRoute.source_channel_id}</div>
            <div><strong>Destination:</strong> {editingRoute.dest_team_name || editingRoute.dest_team_id} / {editingRoute.dest_channel_id}</div>
            <div><strong>Created:</strong> {editingRoute.created_at}</div>
          </div>
        </div>
      );
    }

    return <div style={{ color: '#6b7280' }}>Select a route or item to edit.</div>;
  };

  const renderCenterContent = () => {
    if (activeTab === 'routes') return renderRoutesList();
    if (activeTab === 'mappings') return renderMappingsList();
    return (
      <div>
        <h3>Channels</h3>
        {selectedWorkspace ? (
          channels.map((ch) => (
            <div
              key={ch.id}
              style={{
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div><strong>{ch.name}</strong> {ch.is_private ? '🔒' : '💬'}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {ch.id}</div>
            </div>
          ))
        ) : (
          <div style={{ color: '#6b7280' }}>Select a workspace to view channels.</div>
        )}
      </div>
    );
  };

  return (
    <div style={gridStyle}>
      <div style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2>Workspaces</h2>
          <Link to="/auth/slack" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 12px', borderRadius: '10px', background: '#2563eb', color: '#fff', border: 'none' }}>
              Connect Slack Workspace
            </button>
          </Link>
        </div>
        {renderWorkspacesList()}
      </div>

      <div style={panelStyle}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button style={tabButtonStyle(activeTab === 'workspaces')} onClick={() => setActiveTab('workspaces')}>
            Workspaces
          </button>
          <button style={tabButtonStyle(activeTab === 'routes')} onClick={() => setActiveTab('routes')}>
            Routes
          </button>
          <button style={tabButtonStyle(activeTab === 'mappings')} onClick={() => setActiveTab('mappings')}>
            Mappings
          </button>
        </div>

        {loading && <div style={{ padding: '8px', color: '#6b7280' }}>Loading…</div>}
        {error && <div style={{ padding: '8px', color: '#b91c1c' }}>{error}</div>}
        {!loading && renderCenterContent()}
      </div>

      <div style={panelStyle}>
        <h2>Details</h2>
        {renderRightPanel()}
      </div>
    </div>
  );
}

export default Dashboard;
