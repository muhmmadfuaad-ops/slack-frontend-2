import ConnectSlackButton from './ConnectSlackButton';

function WorkspacesList({ workspaces = [], selectedWorkspace, onSelectWorkspace, onMarkInternal, onRefresh }) {
  // Check if any workspace is already marked as internal
  const hasInternalWorkspace = workspaces.some((ws) => ws.is_internal);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h3 style={{ margin: 0 }}>Workspaces</h3>
        <ConnectSlackButton onConnected={onRefresh} />
      </div>
      {workspaces.map((ws) => {
        const isSelected = ws.team_id === selectedWorkspace?.team_id;
        return (
          <div
            key={ws.team_id}
            onClick={() => onSelectWorkspace && onSelectWorkspace(ws)}
            style={{
              padding: '10px',
              marginBottom: '8px',
              borderRadius: '10px',
              border: isSelected ? '2px solid #111827' : '1px solid #e5e7eb',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'black' }}>
                {ws.is_internal ? '🟢' : '🟡'} {ws.team_name || ws.team_id}
              </span>
              {ws.is_internal && <span title="Internal workspace">🏠 INTERNAL</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Connected: {ws.connected_at}</div>
            {!ws.is_internal && (
              <div style={{ marginTop: '6px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!hasInternalWorkspace) {
                      onMarkInternal && onMarkInternal(ws);
                    }
                  }}
                  disabled={hasInternalWorkspace}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: hasInternalWorkspace ? '#9ca3af' : '#2563eb',
                    color: '#fff',
                    border: 'none',
                    cursor: hasInternalWorkspace ? 'not-allowed' : 'pointer',
                  }}
                >
                  Mark Internal
                </button>
              </div>
            )}
          </div>
        );
      })}
      {!workspaces.length && <div style={{ color: '#6b7280' }}>No workspaces connected.</div>}
    </div>
  );
}

export default WorkspacesList;
