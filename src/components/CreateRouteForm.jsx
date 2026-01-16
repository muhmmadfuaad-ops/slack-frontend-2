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

function CreateRouteForm({ workspaces = [], channels = [], route = null, onSave, onCancel }) {
  const [sourceTeamId, setSourceTeamId] = useState(route?.source_team_id || '');
  const [destTeamId, setDestTeamId] = useState(route?.dest_team_id || '');
  const [sourceChannelId, setSourceChannelId] = useState(route?.source_channel_id || '');
  const [destChannelId, setDestChannelId] = useState(route?.dest_channel_id || '');
  const [direction, setDirection] = useState(route?.direction || 'inbound');
  const [name, setName] = useState(route?.name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setSourceTeamId(route?.source_team_id || '');
    setDestTeamId(route?.dest_team_id || '');
    setSourceChannelId(route?.source_channel_id || '');
    setDestChannelId(route?.dest_channel_id || '');
    setDirection(route?.direction || 'inbound');
    setName(route?.name || '');
    setSuccess(null);
    setError(null);
  }, [route]);

  const sourceChannels = useMemo(() => {
    if (!sourceTeamId) return [];
    return channels.filter((ch) => !ch.team_id || ch.team_id === sourceTeamId);
  }, [channels, sourceTeamId]);

  const destChannels = useMemo(() => {
    if (!destTeamId) return [];
    return channels.filter((ch) => !ch.team_id || ch.team_id === destTeamId);
  }, [channels, destTeamId]);

  const isValid =
    sourceTeamId && destTeamId && sourceChannelId && destChannelId && direction;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValid || saving) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    const data = {
      source_team_id: sourceTeamId,
      source_channel_id: sourceChannelId,
      dest_team_id: destTeamId,
      dest_channel_id: destChannelId,
      direction,
      name,
    };

    try {
      await onSave(data);
      setSuccess('Route saved successfully.');
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      setError(err?.message || 'Failed to save route');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Route Name (optional)</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="Client → Internal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Source Workspace</label>
        <select
          style={inputStyle}
          value={sourceTeamId}
          onChange={(e) => {
            setSourceTeamId(e.target.value);
            setSourceChannelId('');
          }}
        >
          <option value="">Select workspace</option>
          {workspaces.map((ws) => (
            <option key={ws.team_id} value={ws.team_id}>
              {ws.team_name || ws.team_id}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Source Channel</label>
        <select
          style={inputStyle}
          value={sourceChannelId}
          disabled={!sourceTeamId || !sourceChannels.length}
          onChange={(e) => setSourceChannelId(e.target.value)}
        >
          <option value="">{sourceTeamId ? 'Select channel' : 'Select a workspace first'}</option>
          {sourceChannels.map((ch) => (
            <option key={ch.id || ch.channel_id} value={ch.id || ch.channel_id}>
              #{ch.name || ch.id}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Destination Workspace</label>
        <select
          style={inputStyle}
          value={destTeamId}
          onChange={(e) => {
            setDestTeamId(e.target.value);
            setDestChannelId('');
          }}
        >
          <option value="">Select workspace</option>
          {workspaces.map((ws) => (
            <option key={ws.team_id} value={ws.team_id}>
              {ws.team_name || ws.team_id}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Destination Channel</label>
        <select
          style={inputStyle}
          value={destChannelId}
          disabled={!destTeamId || !destChannels.length}
          onChange={(e) => setDestChannelId(e.target.value)}
        >
          <option value="">{destTeamId ? 'Select channel' : 'Select a workspace first'}</option>
          {destChannels.map((ch) => (
            <option key={ch.id || ch.channel_id} value={ch.id || ch.channel_id}>
              #{ch.name || ch.id}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Direction</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { value: 'inbound', label: 'Inbound (→)' },
            { value: 'outbound', label: 'Outbound (←)' },
            { value: 'bidirectional', label: 'Bidirectional (↔)' },
          ].map((opt) => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="direction"
                value={opt.value}
                checked={direction === opt.value}
                onChange={() => setDirection(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
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

export default CreateRouteForm;
