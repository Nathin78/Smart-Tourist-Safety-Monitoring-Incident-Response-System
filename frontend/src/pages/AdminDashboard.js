import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import {
  getAllTourists,
  getAllIncidents,
  getAllSOSAlerts,
  getAllGeoFences,
  getLiveLocations,
  resolveIncident,
  resolveSOSAlert,
} from '../services/api';
import toast from 'react-hot-toast';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
};

const formatNumber = (value, digits = 4) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(digits) : '-';
};

const AdminDashboard = () => {
  const [tourists, setTourists] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [geoFences, setGeoFences] = useState([]);
  const [liveLocations, setLiveLocations] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(
    async ({ silent = true } = {}) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const [
          touristsRes,
          incidentsRes,
          sosRes,
          geoRes,
          liveRes,
        ] = await Promise.allSettled([
          getAllTourists(),
          getAllIncidents(),
          getAllSOSAlerts(),
          getAllGeoFences(),
          getLiveLocations(),
        ]);

        if (touristsRes.status === 'fulfilled') {
          setTourists(touristsRes.value.data || []);
        }

        if (incidentsRes.status === 'fulfilled') {
          setIncidents(incidentsRes.value.data || []);
        }

        if (sosRes.status === 'fulfilled') {
          setSosAlerts(sosRes.value.data || []);
        }

        if (geoRes.status === 'fulfilled') {
          setGeoFences(geoRes.value.data || []);
        }

        if (liveRes.status === 'fulfilled') {
          setLiveLocations(liveRes.value.data || []);
        }

        if (
          touristsRes.status === 'rejected' ||
          incidentsRes.status === 'rejected' ||
          sosRes.status === 'rejected' ||
          geoRes.status === 'rejected' ||
          liveRes.status === 'rejected'
        ) {
          const failedCount = [
            touristsRes,
            incidentsRes,
            sosRes,
            geoRes,
            liveRes,
          ].filter((result) => result.status === 'rejected').length;

          if (!silent) {
            toast.error(
              failedCount === 1
                ? 'Some admin data failed to load'
                : 'Multiple admin data feeds failed to load'
            );
          }
        }

        setLastUpdated(new Date());
      } catch (error) {
        if (!silent) {
          toast.error('Failed to load admin dashboard');
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    const safeLoad = (options) => {
      if (!cancelled) {
        loadData(options);
      }
    };

    safeLoad({ silent: false });

    const intervalId = setInterval(() => {
      if (!document.hidden) {
        safeLoad({ silent: true });
      }
    }, 10000);

    const handleFocus = () => {
      if (!document.hidden) {
        safeLoad({ silent: true });
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        safeLoad({ silent: true });
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadData]);

  const handleResolveIncident = async (incidentId) => {
    try {
      await resolveIncident(incidentId);
      toast.success('Incident resolved');
      loadData({ silent: true });
    } catch (error) {
      toast.error('Failed to resolve incident');
    }
  };

  const handleResolveSOSAlert = async (alertId) => {
    try {
      await resolveSOSAlert(alertId, 'Resolved by admin');
      toast.success('SOS alert resolved');
      loadData({ silent: true });
    } catch (error) {
      toast.error('Failed to resolve SOS alert');
    }
  };

  const filteredTourists = tourists.filter((tourist) => {
    const haystack = [
      tourist.id,
      tourist.name,
      tourist.email,
      tourist.phone,
      tourist.emergencyContact,
      tourist.sosEmail,
      tourist.country,
      tourist.passportNumber,
      tourist.role,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(searchTerm.trim().toLowerCase());
  });

  const openIncidents = incidents.filter((incident) => incident.status === 'OPEN');
  const activeSOSAlerts = sosAlerts.filter((alert) => alert.status === 'ACTIVE');
  const activeGeoFences = geoFences.filter((fence) => fence.isActive !== false);

  return (
    <div className="min-h-screen theme-bg text-black">
      <Navbar />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Complete live overview of tourists, incidents, SOS alerts, geofences, and tracking.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Loading...'}
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 font-semibold mb-2">Total Tourists</p>
                <p className="text-3xl font-bold text-blue-600">{tourists.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 font-semibold mb-2">Open Incidents</p>
                <p className="text-3xl font-bold text-red-600">{openIncidents.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 font-semibold mb-2">Active SOS</p>
                <p className="text-3xl font-bold text-orange-600">{activeSOSAlerts.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 font-semibold mb-2">Safety Zones</p>
                <p className="text-3xl font-bold text-green-600">{activeGeoFences.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 font-semibold mb-2">Live Locations</p>
                <p className="text-3xl font-bold text-indigo-600">{liveLocations.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 pt-4">
                <div className="flex flex-wrap gap-2">
                  {['overview', 'tourists', 'live', 'incidents', 'sos', 'geofences'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-t-lg font-semibold capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tourists, alerts, incidents..."
                  className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-6">
                {loading && tourists.length === 0 && incidents.length === 0 && sosAlerts.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    Loading admin dashboard...
                  </div>
                )}

                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-lg mb-4">Recent Incidents</h3>
                        <div className="space-y-3">
                          {incidents.slice(0, 5).map((incident) => (
                            <div key={incident.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {incident.type} - {incident.tourist?.name || 'Unknown tourist'}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {incident.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatNumber(incident.latitude)}, {formatNumber(incident.longitude)} |
                                    Created: {formatDate(incident.createdAt)}
                                  </p>
                                </div>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    incident.status === 'OPEN'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {incident.status}
                                </span>
                              </div>
                            </div>
                          ))}
                          {incidents.length === 0 && (
                            <p className="text-sm text-gray-600">No incidents yet.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-4">Active SOS Alerts</h3>
                        <div className="space-y-3">
                          {activeSOSAlerts.slice(0, 5).map((alert) => (
                            <div key={alert.id} className="p-3 bg-red-50 rounded-lg">
                              <p className="font-semibold text-gray-800">
                                {alert.tourist?.name || 'Unknown tourist'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatNumber(alert.latitude)}, {formatNumber(alert.longitude)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                SOS Email: {alert.tourist?.sosEmail || alert.tourist?.email || '-'}
                              </p>
                            </div>
                          ))}
                          {activeSOSAlerts.length === 0 && (
                            <p className="text-sm text-gray-600">No active SOS alerts.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-lg mb-4">Live Tourist Snapshots</h3>
                        <div className="space-y-3">
                          {liveLocations.slice(0, 5).map((location) => (
                            <div key={location.touristId} className="p-3 bg-blue-50 rounded-lg">
                              <p className="font-semibold text-gray-800">
                                {location.touristName || `Tourist ${location.touristId}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatNumber(location.latitude)}, {formatNumber(location.longitude)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Updated: {formatDate(location.timestamp)}
                              </p>
                            </div>
                          ))}
                          {liveLocations.length === 0 && (
                            <p className="text-sm text-gray-600">No live locations yet.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-4">Tourist Summary</h3>
                        <div className="space-y-3">
                          {filteredTourists.slice(0, 5).map((tourist) => (
                            <div key={tourist.id} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-semibold text-gray-800">{tourist.name}</p>
                              <p className="text-sm text-gray-600">{tourist.email}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {tourist.country} | {tourist.role || 'USER'}
                              </p>
                            </div>
                          ))}
                          {filteredTourists.length === 0 && (
                            <p className="text-sm text-gray-600">No tourists match the search.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tourists' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700">ID</th>
                          <th className="px-4 py-2 text-left text-gray-700">Name</th>
                          <th className="px-4 py-2 text-left text-gray-700">Email</th>
                          <th className="px-4 py-2 text-left text-gray-700">SOS Email</th>
                          <th className="px-4 py-2 text-left text-gray-700">Phone</th>
                          <th className="px-4 py-2 text-left text-gray-700">Emergency</th>
                          <th className="px-4 py-2 text-left text-gray-700">Country</th>
                          <th className="px-4 py-2 text-left text-gray-700">Passport</th>
                          <th className="px-4 py-2 text-left text-gray-700">Role</th>
                          <th className="px-4 py-2 text-left text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTourists.map((tourist) => (
                          <tr key={tourist.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{tourist.id}</td>
                            <td className="px-4 py-3">{tourist.name}</td>
                            <td className="px-4 py-3">{tourist.email}</td>
                            <td className="px-4 py-3">{tourist.sosEmail || '-'}</td>
                            <td className="px-4 py-3">{tourist.phone || '-'}</td>
                            <td className="px-4 py-3">{tourist.emergencyContact || '-'}</td>
                            <td className="px-4 py-3">{tourist.country || '-'}</td>
                            <td className="px-4 py-3">{tourist.passportNumber || '-'}</td>
                            <td className="px-4 py-3">{tourist.role || 'USER'}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  tourist.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {tourist.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredTourists.length === 0 && (
                          <tr>
                            <td className="px-4 py-4 text-sm text-gray-600" colSpan="10">
                              No tourists match the search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'live' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700">Tourist</th>
                          <th className="px-4 py-2 text-left text-gray-700">Email</th>
                          <th className="px-4 py-2 text-left text-gray-700">Latitude</th>
                          <th className="px-4 py-2 text-left text-gray-700">Longitude</th>
                          <th className="px-4 py-2 text-left text-gray-700">Last Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveLocations.map((location) => (
                          <tr key={location.touristId} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{location.touristName || `Tourist ${location.touristId}`}</td>
                            <td className="px-4 py-3">{location.email || '-'}</td>
                            <td className="px-4 py-3">{formatNumber(location.latitude)}</td>
                            <td className="px-4 py-3">{formatNumber(location.longitude)}</td>
                            <td className="px-4 py-3">{formatDate(location.timestamp)}</td>
                          </tr>
                        ))}
                        {liveLocations.length === 0 && (
                          <tr>
                            <td className="px-4 py-4 text-sm text-gray-600" colSpan="5">
                              No live locations available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'incidents' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700">Type</th>
                          <th className="px-4 py-2 text-left text-gray-700">Tourist</th>
                          <th className="px-4 py-2 text-left text-gray-700">Description</th>
                          <th className="px-4 py-2 text-left text-gray-700">Location</th>
                          <th className="px-4 py-2 text-left text-gray-700">Status</th>
                          <th className="px-4 py-2 text-left text-gray-700">Created</th>
                          <th className="px-4 py-2 text-left text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incidents.map((incident) => (
                          <tr key={incident.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{incident.type}</td>
                            <td className="px-4 py-3">{incident.tourist?.name || '-'}</td>
                            <td className="px-4 py-3">
                              <div className="max-w-sm truncate" title={incident.description}>
                                {incident.description}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-sm">
                              {formatNumber(incident.latitude)}, {formatNumber(incident.longitude)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  incident.status === 'OPEN'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {incident.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">{formatDate(incident.createdAt)}</td>
                            <td className="px-4 py-3">
                              {incident.status === 'OPEN' && (
                                <button
                                  onClick={() => handleResolveIncident(incident.id)}
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                  Resolve
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {incidents.length === 0 && (
                          <tr>
                            <td className="px-4 py-4 text-sm text-gray-600" colSpan="7">
                              No incidents available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'sos' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700">Tourist</th>
                          <th className="px-4 py-2 text-left text-gray-700">Email</th>
                          <th className="px-4 py-2 text-left text-gray-700">SOS Email</th>
                          <th className="px-4 py-2 text-left text-gray-700">Location</th>
                          <th className="px-4 py-2 text-left text-gray-700">Status</th>
                          <th className="px-4 py-2 text-left text-gray-700">Created</th>
                          <th className="px-4 py-2 text-left text-gray-700">Notes</th>
                          <th className="px-4 py-2 text-left text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sosAlerts.map((alert) => (
                          <tr key={alert.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{alert.tourist?.name || '-'}</td>
                            <td className="px-4 py-3">{alert.tourist?.email || '-'}</td>
                            <td className="px-4 py-3">{alert.tourist?.sosEmail || '-'}</td>
                            <td className="px-4 py-3 font-mono text-sm">
                              {formatNumber(alert.latitude)}, {formatNumber(alert.longitude)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  alert.status === 'ACTIVE'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {alert.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">{formatDate(alert.createdAt)}</td>
                            <td className="px-4 py-3">
                              <div className="max-w-xs truncate" title={alert.resolvedNotes || '-'}>
                                {alert.resolvedNotes || '-'}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {alert.status === 'ACTIVE' && (
                                <button
                                  onClick={() => handleResolveSOSAlert(alert.id)}
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                >
                                  Resolve
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {sosAlerts.length === 0 && (
                          <tr>
                            <td className="px-4 py-4 text-sm text-gray-600" colSpan="8">
                              No SOS alerts available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'geofences' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700">Zone</th>
                          <th className="px-4 py-2 text-left text-gray-700">Type</th>
                          <th className="px-4 py-2 text-left text-gray-700">Location</th>
                          <th className="px-4 py-2 text-left text-gray-700">Radius</th>
                          <th className="px-4 py-2 text-left text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {geoFences.map((fence) => (
                          <tr key={fence.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{fence.zoneName}</td>
                            <td className="px-4 py-3">{fence.zoneType}</td>
                            <td className="px-4 py-3 font-mono text-sm">
                              {formatNumber(fence.latitude)}, {formatNumber(fence.longitude)}
                            </td>
                            <td className="px-4 py-3">{fence.radius}m</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  fence.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {fence.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {geoFences.length === 0 && (
                          <tr>
                            <td className="px-4 py-4 text-sm text-gray-600" colSpan="5">
                              No geofences configured.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
