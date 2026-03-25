import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { createSOSAlert } from '../services/api';
import toast from 'react-hot-toast';

const SOSEmergency = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosLocation, setSosLocation] = useState(null);
  const [countdown, setCountdown] = useState(5);

  const activateSOS = async () => {
    setSosActive(true);
    setCountdown(5);

    // Get current location
    if (navigator.geolocation) {
      if (!user?.id) {
        toast.error('User session not loaded. Please re-login.');
        setSosActive(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setSosLocation({ latitude, longitude });

          try {
            await createSOSAlert({
              touristId: user?.id,
              latitude,
              longitude,
            });

            // Countdown timer
            let count = 5;
            const timer = setInterval(() => {
              count--;
              setCountdown(count);
              if (count === 0) {
                clearInterval(timer);
                setSosActive(false);
              }
            }, 1000);

            toast.error('🚨 SOS Alert Activated! Emergency services have been notified.');
          } catch (error) {
            toast.error('Failed to send SOS alert');
            setSosActive(false);
          }
        },
        (error) => {
          toast.error('Unable to get your location for SOS');
          setSosActive(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setSosActive(false);
    }
  };

  const cancelSOS = () => {
    setSosActive(false);
    setSosLocation(null);
    toast.success('SOS Alert Cancelled');
  };

  return (
    <div className="min-h-screen theme-bg text-black">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-red-600 mb-4">
                🚨 SOS Emergency
              </h1>
              <p className="text-gray-600 text-lg">
                Press the button below to send an emergency alert
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-12">
              <div className="flex flex-col items-center">
                <button
                  onClick={sosActive ? cancelSOS : activateSOS}
                  disabled={sosActive && countdown > 0}
                  className={`w-48 h-48 rounded-full flex items-center justify-center font-bold text-2xl transition-transform transform hover:scale-105 ${
                    sosActive
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {sosActive ? `${countdown}s` : 'SOS'}
                </button>

                {sosActive && (
                  <div className="mt-8 text-center">
                    <p className="text-red-600 font-semibold mb-4">
                      ⚠ SOS ACTIVATED
                    </p>
                    {sosLocation && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-700 font-mono text-sm">
                          Location: {sosLocation.latitude.toFixed(4)},
                          {sosLocation.longitude.toFixed(4)}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={cancelSOS}
                      className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Cancel SOS
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-800 font-semibold mb-2">Important:</p>
              <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                <li>Only press SOS in genuine emergencies</li>
                <li>Your location will be shared with emergency services</li>
                <li>Emergency services will be notified immediately</li>
                <li>Stay calm and provide details to responders</li>
              </ul>
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-700 text-sm">
                📞 Local Emergency Number: +91-112 (India)
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SOSEmergency;
