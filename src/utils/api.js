import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

export async function getWorkspaces() {
  try {
    const res = await api.get('/api/workspaces');
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getChannels(team_id) {
  try {
    const res = await api.get(`/api/workspaces/${team_id}/channels`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function markInternal(team_id) {
  try {
    const res = await api.post(`/api/workspaces/${team_id}/mark-internal`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getRoutes() {
  try {
    const res = await api.get('/api/routes');
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function createRoute(data) {
  try {
    const res = await api.post('/api/routes', data);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteRoute(route_id) {
  try {
    const res = await api.delete(`/api/routes/${route_id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getIdentityMappings() {
  try {
    const res = await api.get('/api/identity-mappings');
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function createIdentityMapping(data) {
  try {
    const res = await api.post('/api/identity-mappings', data);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteIdentityMapping(key) {
  try {
    const res = await api.delete(`/api/identity-mappings/${key}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}
