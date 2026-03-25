import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getTouristById, getTouristIncidents } from '../services/api';
import toast from 'react-hot-toast';
import { FiPhone, FiMail } from 'react-icons/fi';

const TouristDashboard = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let cancelled = false;

    const loadData = async ({ silent } = { silent: true }) => {
      if (!user?.id) return;
      try {
        const [profileRes, incidentsRes] = await Promise.all([
          getTouristById(user.id),
          getTouristIncidents(user.id),
        ]);

        if (!cancelled) {
          setProfileData(profileRes.data);
          setIncidents(incidentsRes.data || []);
        }
      } catch (error) {
        if (!silent) {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData({ silent: false });

    const intervalId = setInterval(() => {
      if (document.hidden) return;
      loadData({ silent: true });
    }, 5000);

    const handleVisibility = () => {
      if (!document.hidden) {
        loadData({ silent: true });
      }
    };

    window.addEventListener('focus', handleVisibility);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      window.removeEventListener('focus', handleVisibility);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user?.id]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen theme-bg text-black">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-2">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user?.name}!
              </h1>
              <div className="text-gray-600 font-medium">
                {now.toLocaleDateString()} • {now.toLocaleTimeString()}
              </div>
            </div>

            {/* Profile Card */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Profile Information
                </h2>
                {profileData && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 min-w-[120px]">
                        Name:
                      </span>
                      <span className="text-gray-800">{profileData.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-400" />
                      <span className="text-gray-800">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      <span className="text-gray-800">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 min-w-[120px]">
                        Country:
                      </span>
                      <span className="text-gray-800">{profileData.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 min-w-[120px]">
                        Passport:
                      </span>
                      <span className="text-gray-800">
                        {profileData.passportNumber}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Safety Status
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Location</span>
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Open Incidents</span>
                    <span className="text-red-600 font-semibold">
                      {incidents.filter((i) => i.status === 'OPEN').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="text-blue-600 font-semibold">Safe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Recent Incidents
              </h2>
              {incidents.length === 0 ? (
                <p className="text-gray-600">No incidents reported</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700">Type</th>
                        <th className="px-4 py-2 text-left text-gray-700">
                          Description
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.slice(0, 5).map((incident) => (
                        <tr key={incident.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800">
                            {incident.type}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {incident.description.substring(0, 50)}...
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                incident.status === 'OPEN'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {incident.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {new Date(incident.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TouristDashboard;
