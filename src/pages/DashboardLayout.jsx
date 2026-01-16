import { useEffect, useMemo, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import WorkspacesList from '../components/WorkspacesList';
import ChannelsList from '../components/ChannelsList';
import RoutesList from '../components/RoutesList';
import IdentityMappingsList from '../components/IdentityMappingsList';
import CreateRouteForm from '../components/CreateRouteForm';
import CreateIdentityMappingForm from '../components/CreateIdentityMappingForm';
import {
  getWorkspaces,
  getChannels,
  markInternal,
  getRoutes,
  createRoute,
  deleteRoute,
  getIdentityMappings,
  createIdentityMapping,
  deleteIdentityMapping,
} from '../utils/api';
import Connections from '../components/Connections';

const layoutStyle = {
  display: 'grid',
  gridTemplateColumns: '300px 1fr 320px',
  gap: '16px',
  padding: '16px',
  minHeight: '100vh',
  background: '#f3f4f6',
};

const panelStyle = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
  padding: '16px',
  overflow: 'auto',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(17,24,39,0.3)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
};

const toastStyle = (type) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '12px 16px',
  borderRadius: '12px',
  background: type === 'error' ? '#ef4444' : '#16a34a',
  color: '#fff',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  zIndex: 60,
});

function DashboardLayout() {
  const [workspaces, setWorkspaces] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [identityMappings, setIdentityMappings] = useState([]);
  const [channelsByTeam, setChannelsByTeam] = useState({});
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [activeTab, setActiveTab] = useState('workspaces');
  const [editingRoute, setEditingRoute] = useState(null);
  const [editingMapping, setEditingMapping] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const [toast, setToast] = useState(null);

  const loading = loadingCount > 0;

  const allChannels = useMemo(
    () => Object.values(channelsByTeam).flat(),
    [channelsByTeam]
  );

  const startLoading = () => setLoadingCount((c) => c + 1);
  const stopLoading = () => setLoadingCount((c) => Math.max(0, c - 1));

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadWorkspaces = async () => {
    startLoading();
    try {
      const data = await getWorkspaces();
      setWorkspaces(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load workspaces', 'error');
    } finally {
      stopLoading();
    }
  };

  const loadRoutes = async () => {
    startLoading();
    try {
      const data = await getRoutes();
      setRoutes(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load routes', 'error');
    } finally {
      stopLoading();
    }
  };

  const loadIdentityMappings = async () => {
    startLoading();
    try {
      const data = await getIdentityMappings();
      setIdentityMappings(data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load mappings', 'error');
    } finally {
      stopLoading();
    }
  };

  const ensureChannels = async (team_id) => {
    if (!team_id || channelsByTeam[team_id]) return;
    startLoading();
    try {
      const data = await getChannels(team_id);
      const withTeam = (data || []).map((ch) => ({ ...ch, team_id }));
      setChannelsByTeam((prev) => ({ ...prev, [team_id]: withTeam }));
    } catch (err) {
      console.error(err);
      showToast('Failed to load channels', 'error');
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      startLoading();
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
        showToast('Failed to load data', 'error');
      } finally {
        stopLoading();
      }
    };
    loadAll();
  }, []);

  const handleSelectWorkspace = async (workspace) => {
    setSelectedWorkspace(workspace);
    setSelectedChannelId(null);
    setActiveTab('workspaces');
    await ensureChannels(workspace.team_id);
  };

  const handleMarkInternal = async (workspace) => {
    startLoading();
    try {
      await markInternal(workspace.team_id);
      await loadWorkspaces();
      showToast('Workspace marked as internal');
    } catch (err) {
      console.error(err);
      showToast('Failed to mark internal', 'error');
    } finally {
      stopLoading();
    }
  };

  const handleSaveRoute = async (data) => {
    startLoading();
    try {
      await createRoute(data);
      await loadRoutes();
      setEditingRoute(null);
      showToast('Route saved');
    } catch (err) {
      console.error(err);
      showToast('Failed to save route', 'error');
      throw err;
    } finally {
      stopLoading();
    }
  };

  const handleDeleteRoute = async (route) => {
    startLoading();
    try {
      await deleteRoute(route.route_id);
      await loadRoutes();
      showToast('Route deleted');
      if (editingRoute?.route_id === route.route_id) {
        setEditingRoute(null);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete route', 'error');
    } finally {
      stopLoading();
    }
  };

  const handleSaveMapping = async (data) => {
    startLoading();
    try {
      await createIdentityMapping(data);
      await loadIdentityMappings();
      setEditingMapping(null);
      showToast('Mapping saved');
    } catch (err) {
      console.error(err);
      showToast('Failed to save mapping', 'error');
      throw err;
    } finally {
      stopLoading();
    }
  };

  const handleDeleteMapping = async (mapping) => {
    startLoading();
    try {
      await deleteIdentityMapping(mapping.key);
      await loadIdentityMappings();
      showToast('Mapping deleted');
      if (editingMapping?.key === mapping.key) {
        setEditingMapping(null);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete mapping', 'error');
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (editingRoute) {
      ensureChannels(editingRoute.source_team_id);
      ensureChannels(editingRoute.dest_team_id);
    }
  }, [editingRoute]);

  const centerContent = () => {
    if (activeTab === 'routes') {
      return (
        <RoutesList
          routes={routes}
          workspaces={workspaces}
          onEditRoute={(route) => {
            setEditingRoute(route);
            setActiveTab('routes');
          }}
          onDeleteRoute={handleDeleteRoute}
        />
      );
    }

    if (activeTab === 'mappings') {
      return (
        <IdentityMappingsList
          identityMappings={identityMappings}
          workspaces={workspaces}
          onAddMapping={(mapping) => {
            setEditingMapping(mapping || null);
            setActiveTab('mappings');
          }}
          onDeleteMapping={handleDeleteMapping}
        />
      );
    }

    const channels = selectedWorkspace ? channelsByTeam[selectedWorkspace.team_id] || [] : [];
    return (
      // <ChannelsList
      //   channels={channels}
      //   selectedWorkspace={selectedWorkspace}
      //   loading={loading && !!selectedWorkspace}
      //   selectedChannelId={selectedChannelId}
      //   onSelectChannel={(ch) => setSelectedChannelId(ch.id)}
      //   onCreateMapping={() => {
      //     setActiveTab('mappings');
      //     setEditingMapping(null);
      //   }}
      // />
      <></>
    );
  };

  // const rightPanel = () => {
  //   if (activeTab === 'routes') {
  //     return (
  //       <CreateRouteForm
  //         workspaces={workspaces}
  //         channels={allChannels}
  //         route={editingRoute}
  //         onSave={handleSaveRoute}
  //         onCancel={() => setEditingRoute(null)}
  //       />
  //     );
  //   }

  //   if (activeTab === 'mappings') {
  //     return (
  //       <CreateIdentityMappingForm
  //         workspaces={workspaces}
  //         mapping={editingMapping}
  //         onSave={handleSaveMapping}
  //         onCancel={() => setEditingMapping(null)}
  //       />
  //     );
  //   }

  //   return <div style={{ color: '#6b7280' }}>Select a route or mapping to edit.</div>;
  // };

  return (
    <div>
      <DashboardHeader activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      <div style={layoutStyle}>
        <div style={panelStyle}>
          <WorkspacesList
            workspaces={workspaces}
            selectedWorkspace={selectedWorkspace}
            onSelectWorkspace={handleSelectWorkspace}
            onMarkInternal={handleMarkInternal}
            onRefresh={() => {
              loadWorkspaces();
              loadRoutes();
            }}
          />
          <Connections workspaces={workspaces} />
        </div>

        <div style={panelStyle}>{centerContent()}</div>

        {/* <div style={panelStyle}>{rightPanel()}</div> */}
      </div>

      {loading && (
        <div style={overlayStyle}>
          <div>Loading…</div>
        </div>
      )}

      {toast && <div style={toastStyle(toast.type)}>{toast.message}</div>}
    </div>
  );
}

export default DashboardLayout;
