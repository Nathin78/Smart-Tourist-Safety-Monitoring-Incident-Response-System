import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { reportIncident, getLatestLocation } from '../services/api';
import toast from 'react-hot-toast';

const IncidentReporting = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'theft',
    description: '',
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);

  const incidentTypes = [
    'theft',
    'harassment',
    'lost_documents',
    'medical_emergency',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getLocation = async () => {
    try {
      if (user?.id) {
        const response = await getLatestLocation(user.id);
        setFormData({
          ...formData,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
        });
        toast.success('Location loaded from last known position');
      }
    } catch (error) {
      toast.error('Could not retrieve location');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reportIncident({
        touristId: user?.id,
        ...formData,
      });
      toast.success('Incident reported successfully!');
      setFormData({ type: 'theft', description: '', latitude: 0, longitude: 0 });
    } catch (error) {
      toast.error('Failed to report incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg text-black">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Report Incident
            </h1>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Incident Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {incidentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace(/_/g, ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed information about the incident..."
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      step="0.0001"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      step="0.0001"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={getLocation}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Get Current Location
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 font-semibold"
                  >
                    {loading ? 'Reporting...' : 'Report Incident'}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-semibold mb-2">⚠ Important:</p>
              <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                <li>Provide accurate information to help authorities respond quickly</li>
                <li>Include as many details as possible about the incident</li>
                <li>Your location will be shared with emergency responders</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IncidentReporting;
