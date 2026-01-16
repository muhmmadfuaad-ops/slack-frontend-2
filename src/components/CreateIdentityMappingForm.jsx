import { useEffect, useMemo, useState } from 'react';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  marginBottom: '12px',
};

const labelStyle = { fontWeight: 600, display: 'block', marginBottom: '6px' };

const buttonPrimary = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #2563eb',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

const buttonSecondary = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  background: '#fff',
  color: '#111827',
  cursor: 'pointer',
  fontWeight: 600,
};

function CreateIdentityMappingForm({ workspaces = [], mapping = null, onSave, onCancel }) {
  const [internalUserId, setInternalUserId] = useState(mapping?.internal_user_id || '');
  const [internalUsername, setInternalUsername] = useState(mapping?.internal_username || '');
  const [clientTeamId, setClientTeamId] = useState(mapping?.client_team_id || '');
  const [clientUserId, setClientUserId] = useState(mapping?.client_user_id || '');
  const [clientUsername, setClientUsername] = useState(mapping?.client_username || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setInternalUserId(mapping?.internal_user_id || '');
    setInternalUsername(mapping?.internal_username || '');
    setClientTeamId(mapping?.client_team_id || '');
    setClientUserId(mapping?.client_user_id || '');
    setClientUsername(mapping?.client_username || '');
    setError(null);
    setSuccess(null);
  }, [mapping]);

  const workspaceOptions = useMemo(
    () => workspaces.map((ws) => ({ value: ws.team_id, label: ws.team_name || ws.team_id })),
    [workspaces]
  );

  const isValid =
    internalUserId && internalUsername && clientTeamId && clientUserId && clientUsername;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValid || saving) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const key = `${internalUserId}:${clientTeamId}`;
    const data = {
      key,
      internal_user_id: internalUserId,
      internal_username: internalUsername,
      client_team_id: clientTeamId,
      client_user_id: clientUserId,
      client_username: clientUsername,
    };

    try {
      await onSave(data);
      setSuccess('Mapping saved successfully.');
      if (onCancel) onCancel();
    } catch (err) {
      setError(err?.message || 'Failed to save mapping');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Internal User ID</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="U12345"
          value={internalUserId}
          onChange={(e) => setInternalUserId(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Internal Username</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="Alice"
          value={internalUsername}
          onChange={(e) => setInternalUsername(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Client Workspace</label>
        <select
          style={inputStyle}
          value={clientTeamId}
          onChange={(e) => setClientTeamId(e.target.value)}
        >
          <option value="">Select workspace</option>
          {workspaceOptions.map((ws) => (
            <option key={ws.value} value={ws.value}>
              {ws.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Client User ID</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="U67890"
          value={clientUserId}
          onChange={(e) => setClientUserId(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Client Username (display name)</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="Bob"
          value={clientUsername}
          onChange={(e) => setClientUsername(e.target.value)}
        />
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: '#15803d', marginBottom: '10px' }}>{success}</div>}

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button type="submit" style={buttonPrimary} disabled={!isValid || saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" style={buttonSecondary} onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CreateIdentityMappingForm;
