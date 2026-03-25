import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:8081/api';

const normalizeBaseUrl = (value) => value.replace(/\/+$/, '');

const resolveApiBaseUrl = () => {
  const envBase = (process.env.REACT_APP_API_BASE_URL || '').trim();
  if (envBase) {
    return normalizeBaseUrl(envBase);
  }

  if (typeof window === 'undefined') {
    return DEFAULT_API_BASE_URL;
  }

  const { protocol, hostname } = window.location;
  return normalizeBaseUrl(`${protocol}//${hostname}:8081/api`);
};

const API_BASE_URL = resolveApiBaseUrl();
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';

    if (status === 401 && !url.includes('/auth/')) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location?.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Tourist APIs
export const getAllTourists = () => api.get('/tourists');
export const getTouristById = (id) => api.get(`/tourists/${id}`);

// Location APIs
export const updateLocation = (data) => api.post('/location/update', data);
export const getLocationHistory = (touristId) => api.get(`/location/history/${touristId}`);
export const getLatestLocation = (touristId) => api.get(`/location/latest/${touristId}`);
export const getLiveLocations = () => api.get('/location/live');

// Incident APIs
export const reportIncident = (data) => api.post('/incidents/report', data);
export const getAllIncidents = () => api.get('/incidents');
export const getTouristIncidents = (touristId) => api.get(`/incidents/tourist/${touristId}`);
export const getOpenIncidents = () => api.get('/incidents/open');
export const getIncidentById = (id) => api.get(`/incidents/${id}`);
export const resolveIncident = (id) => api.put(`/incidents/${id}/resolve`);

// GeoFence APIs
export const getAllGeoFences = () => api.get('/geofences');
export const getActiveGeoFences = () => api.get('/geofences/active');
export const getGeoFencesByType = (type) => api.get(`/geofences/type/${type}`);
export const createGeoFence = (data) => api.post('/geofences', data);
export const updateGeoFence = (id, data) => api.put(`/geofences/${id}`, data);
export const deleteGeoFence = (id) => api.delete(`/geofences/${id}`);

// SOS Alert APIs
export const createSOSAlert = (data) => api.post('/sos', data);
export const getAllSOSAlerts = () => api.get('/sos');
export const getActiveSOSAlerts = () => api.get('/sos/active');
export const getTouristSOSAlerts = (touristId) => api.get(`/sos/tourist/${touristId}`);
export const getSOSAlertById = (id) => api.get(`/sos/${id}`);
export const resolveSOSAlert = (id, notes) => api.put(`/sos/${id}/resolve?notes=${notes}`);

export default api;
