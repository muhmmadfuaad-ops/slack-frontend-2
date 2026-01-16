import { useState } from 'react';
import ConnectSlackButton from './ConnectSlackButton';

function WorkspacesList({ workspaces = [], selectedWorkspace, onSelectWorkspace, onMarkInternal, onRefresh }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if any workspace is already marked as internal
  const hasInternalWorkspace = workspaces.some((ws) => ws.is_internal);

  return (
    <div className="mb-6">
      {/* Header with Connect button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 font-semibold text-lg m-0">Workspaces</h3>
        <ConnectSlackButton onConnected={onRefresh} />
      </div>

      {/* Collapsible section header */}
      <div
        className="flex justify-between items-center py-2 px-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-gray-700 font-medium">
          Connected Workspaces ({workspaces.length})
        </span>
        <span className="text-gray-500 text-sm">
          {isCollapsed ? '▶' : '▼'}
        </span>
      </div>

      {/* Collapsible content */}
      {!isCollapsed && (
        <div className="mt-2 space-y-2">
          {workspaces.map((ws) => {
            const isSelected = ws.team_id === selectedWorkspace?.team_id;
            return (
              <div
                key={ws.team_id}
                onClick={() => onSelectWorkspace && onSelectWorkspace(ws)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${isSelected
                    ? 'border-gray-800 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">
                    {ws.is_internal ? '🟢' : '🟡'} {ws.team_name || ws.team_id}
                  </span>
                  {ws.is_internal && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full" title="Internal workspace">
                      🏠 INTERNAL
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Connected: {ws.connected_at}
                </div>
                {!ws.is_internal && (
                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasInternalWorkspace) {
                          onMarkInternal && onMarkInternal(ws);
                        }
                      }}
                      disabled={hasInternalWorkspace}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${hasInternalWorkspace
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                        }`}
                    >
                      Mark Internal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {!workspaces.length && (
            <div className="text-gray-500 text-sm py-2">No workspaces connected.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkspacesList;
