import { useEffect, useMemo, useState } from 'react';

const cardStyle = {
  padding: '12px',
  marginBottom: '10px',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  background: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
};

const buttonStyle = {
  padding: '8px 12px',
  borderRadius: '10px',
  border: '1px solid #2563eb',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
};

const iconForDirection = (direction) => {
  if (direction === 'bidirectional') return '↔';
  if (direction === 'outbound') return '←';
  return '→'; // default/inbound
};

function RoutesList({ routes = [], workspaces = [], onEditRoute, onDeleteRoute }) {
  const [enabledState, setEnabledState] = useState({});

  useEffect(() => {
    const initial = {};
    routes.forEach((r) => {
      initial[r.route_id] = r.enabled !== false;
    });
    setEnabledState(initial);
  }, [routes]);

  const workspaceNameById = useMemo(() => {
    const map = new Map();
    workspaces.forEach((ws) => map.set(ws.team_id, ws.team_name || ws.team_id));
    return map;
  }, [workspaces]);

  const groupedRoutes = useMemo(() => {
    const groups = new Map();
    routes.forEach((route) => {
      const key = route.source_team_id;
      const name = route.source_team_name || workspaceNameById.get(route.source_team_id) || route.source_team_id;
      if (!groups.has(key)) {
        groups.set(key, { sourceTeamId: key, sourceTeamName: name, items: [] });
      }
      groups.get(key).items.push(route);
    });
    return Array.from(groups.values());
  }, [routes, workspaceNameById]);

  const handleDelete = (route) => {
    if (!onDeleteRoute) return;
    const confirmed = window.confirm('Are you sure?');
    if (confirmed) {
      onDeleteRoute(route);
    }
  };

  const handleToggle = (route) => {
    setEnabledState((prev) => ({
      ...prev,
      [route.route_id]: !prev[route.route_id],
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>Routes</h3>
        <button style={buttonStyle} onClick={() => onEditRoute && onEditRoute(null)}>
          Create New Route
        </button>
      </div>

      {!routes.length && (
        <div style={{ color: '#6b7280' }}>No routes created yet. Click "Create Route" to add one.</div>
      )}

      {groupedRoutes.map((group) => (
        <div key={group.sourceTeamId} style={{ marginBottom: '16px' }}>
          <div style={{ fontWeight: '700', marginBottom: '8px' }}>{group.sourceTeamName}</div>
          {group.items.map((route) => {
            const destName =
              route.dest_team_name || workspaceNameById.get(route.dest_team_id) || route.dest_team_id;
            const arrow = iconForDirection(route.direction);
            const enabled = enabledState[route.route_id] !== false;

            return (
              <div key={route.route_id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontWeight: '600' }}>
                      {group.sourceTeamName} → {route.source_channel_id}
                    </div>
                    <div>{arrow}</div>
                    <div style={{ fontWeight: '600' }}>
                      {destName} → {route.dest_channel_id}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{enabled ? 'Enabled' : 'Disabled'}</span>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleToggle(route)}
                        style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                      />
                    </label>
                    <button
                      onClick={() => onEditRoute && onEditRoute(route)}
                      style={{ ...buttonStyle, background: '#111827', borderColor: '#111827' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(route)}
                      style={{ ...buttonStyle, background: '#ef4444', borderColor: '#ef4444' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                  Direction: {route.direction} • Created: {route.created_at}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default RoutesList;
