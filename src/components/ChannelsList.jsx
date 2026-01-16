import { useMemo } from 'react';

function ChannelsList({
  channels = [],
  selectedWorkspace,
  loading = false,
  selectedChannelId,
  onSelectChannel,
  onCreateMapping,
}) {
  const workspaceName = selectedWorkspace?.team_name || selectedWorkspace?.team_id;

  const content = useMemo(() => {
    if (!selectedWorkspace) {
      return <div style={{ color: '#6b7280' }}>Select a workspace</div>;
    }

    if (loading) {
      return <div style={{ color: '#6b7280' }}>Loading…</div>;
    }

    if (!channels.length) {
      return <div style={{ color: '#6b7280' }}>No channels found.</div>;
    }

    return channels.map((channel) => {
      const isSelected = channel.id === selectedChannelId;
      const memberCount = channel.num_members ?? channel.member_count ?? channel.members_count;

      return (
        <div
          key={channel.id}
          onClick={() => onSelectChannel && onSelectChannel(channel)}
          style={{
            padding: '10px',
            marginBottom: '8px',
            borderRadius: '10px',
            border: isSelected ? '2px solid #111827' : '1px solid #e5e7eb',
            cursor: 'pointer',
            background: isSelected ? '#eef2ff' : '#fff',
            transition: 'background 0.2s ease, border 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isSelected) e.currentTarget.style.background = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.currentTarget.style.background = '#fff';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600' }}>#{channel.name}</span>
            {channel.is_private && (
              <span
                style={{
                  padding: '2px 6px',
                  background: '#fee2e2',
                  color: '#b91c1c',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              >
                Private
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {memberCount ? `${memberCount} members` : 'Member count unavailable'}
          </div>
        </div>
      );
    });
  }, [selectedWorkspace, loading, channels, selectedChannelId, onSelectChannel]);

  return (
    <div>
      <div style={{ marginBottom: '8px', color: '#111827', fontWeight: '700' }}>
        Channels {workspaceName ? `· ${workspaceName}` : ''}
      </div>
      {content}
      <div style={{ marginTop: '12px' }}>
        <button
          onClick={() => onCreateMapping && onCreateMapping()}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #2563eb',
            background: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Create mapping
        </button>
      </div>
    </div>
  );
}

export default ChannelsList;
