import { useMemo } from 'react';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '12px',
};

const thStyle = {
  textAlign: 'left',
  padding: '10px',
  borderBottom: '1px solid #e5e7eb',
  background: '#f9fafb',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #f3f4f6',
};

const buttonPrimary = {
  padding: '8px 12px',
  borderRadius: '10px',
  border: '1px solid #2563eb',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

function IdentityMappingsList({ identityMappings = [], workspaces = [], onAddMapping, onDeleteMapping }) {
  const workspaceNameById = useMemo(() => {
    const map = new Map();
    workspaces.forEach((ws) => map.set(ws.team_id, ws.team_name || ws.team_id));
    return map;
  }, [workspaces]);

  const handleDelete = (mapping) => {
    if (!onDeleteMapping) return;
    const ok = window.confirm('Are you sure you want to delete this mapping?');
    if (ok) onDeleteMapping(mapping);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Identity Mappings</h3>
        <button style={buttonPrimary} onClick={() => onAddMapping && onAddMapping()}>
          Add New Mapping
        </button>
      </div>

      {!identityMappings.length && <div style={{ color: '#6b7280', marginTop: '8px' }}>No identity mappings created yet.</div>}

      {!!identityMappings.length && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Internal User</th>
              <th style={thStyle}>Client Workspace</th>
              <th style={thStyle}>Client User</th>
              <th style={thStyle}>Mapped Display Name</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {identityMappings.map((mapping) => {
              const clientName = workspaceNameById.get(mapping.client_team_id) || mapping.client_team_id;
              return (
                <tr
                  key={mapping.key}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={tdStyle}>{mapping.internal_username || mapping.internal_user_id}</td>
                  <td style={tdStyle}>{clientName}</td>
                  <td style={tdStyle}>{mapping.client_username || mapping.client_user_id}</td>
                  <td style={tdStyle}>{mapping.client_username || '—'}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{ ...buttonPrimary, background: '#111827', borderColor: '#111827' }}
                        onClick={() => onAddMapping && onAddMapping(mapping)}
                      >
                        Edit
                      </button>
                      <button
                        style={{ ...buttonPrimary, background: '#ef4444', borderColor: '#ef4444' }}
                        onClick={() => handleDelete(mapping)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IdentityMappingsList;
