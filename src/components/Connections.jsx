import { useState, useEffect } from 'react';
import { getChannels } from '../utils/api';

function Connections({ workspaces = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [sourceWorkspace, setSourceWorkspace] = useState('');
  const [destWorkspace, setDestWorkspace] = useState('');
  const [sourceChannel, setSourceChannel] = useState('');
  const [destChannel, setDestChannel] = useState('');
  const [sourceChannels, setSourceChannels] = useState([]);
  const [destChannels, setDestChannels] = useState([]);
  const [loadingSource, setLoadingSource] = useState(false);
  const [loadingDest, setLoadingDest] = useState(false);

  // Fetch channels when source workspace changes
  useEffect(() => {
    if (!sourceWorkspace) {
      setSourceChannels([]);
      setSourceChannel('');
      return;
    }
    const fetchChannels = async () => {
      setLoadingSource(true);
      try {
        const data = await getChannels(sourceWorkspace);
        setSourceChannels(data || []);
      } catch (err) {
        console.error('Failed to load source channels:', err);
        setSourceChannels([]);
      } finally {
        setLoadingSource(false);
      }
    };
    fetchChannels();
  }, [sourceWorkspace]);

  // Fetch channels when destination workspace changes
  useEffect(() => {
    if (!destWorkspace) {
      setDestChannels([]);
      setDestChannel('');
      return;
    }
    const fetchChannels = async () => {
      setLoadingDest(true);
      try {
        const data = await getChannels(destWorkspace);
        setDestChannels(data || []);
      } catch (err) {
        console.error('Failed to load destination channels:', err);
        setDestChannels([]);
      } finally {
        setLoadingDest(false);
      }
    };
    fetchChannels();
  }, [destWorkspace]);

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSourceWorkspace('');
    setDestWorkspace('');
    setSourceChannel('');
    setDestChannel('');
    setSourceChannels([]);
    setDestChannels([]);
  };

  const isFormValid = sourceWorkspace && destWorkspace && sourceChannel && destChannel;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 font-semibold text-lg m-0">Connections</h3>
        {!showForm && (
          <button
            onClick={handleCreateClick}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Create a new Connection
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-gray-700 font-medium mb-4">New Connection</h4>

          {/* Source Section */}
          <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Source</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Source Workspace Dropdown */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Workspace</label>
                <select
                  value={sourceWorkspace}
                  onChange={(e) => {
                    setSourceWorkspace(e.target.value);
                    setSourceChannel('');
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select workspace...</option>
                  {workspaces.map((ws) => (
                    <option key={ws.team_id} value={ws.team_id}>
                      {ws.is_internal ? '🟢' : '🟡'} {ws.team_name || ws.team_id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Channel Dropdown */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Channel</label>
                <select
                  value={sourceChannel}
                  onChange={(e) => setSourceChannel(e.target.value)}
                  disabled={!sourceWorkspace || loadingSource}
                  className={`w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!sourceWorkspace || loadingSource
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-800'
                    }`}
                >
                  <option value="">
                    {loadingSource ? 'Loading...' : 'Select channel...'}
                  </option>
                  {sourceChannels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.is_private ? '🔒' : '#'} {ch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center my-2">
            <span className="text-gray-400 text-xl">↓</span>
          </div>

          {/* Destination Section */}
          <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Destination</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Destination Workspace Dropdown */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Workspace</label>
                <select
                  value={destWorkspace}
                  onChange={(e) => {
                    setDestWorkspace(e.target.value);
                    setDestChannel('');
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select workspace...</option>
                  {workspaces.map((ws) => (
                    <option key={ws.team_id} value={ws.team_id}>
                      {ws.is_internal ? '🟢' : '🟡'} {ws.team_name || ws.team_id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Channel Dropdown */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Channel</label>
                <select
                  value={destChannel}
                  onChange={(e) => setDestChannel(e.target.value)}
                  disabled={!destWorkspace || loadingDest}
                  className={`w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!destWorkspace || loadingDest
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-800'
                    }`}
                >
                  <option value="">
                    {loadingDest ? 'Loading...' : 'Select channel...'}
                  </option>
                  {destChannels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.is_private ? '🔒' : '#'} {ch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!isFormValid}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isFormValid
                  ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Create Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Connections;
