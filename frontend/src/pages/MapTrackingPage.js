import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { updateLocation, getAllGeoFences, getLiveLocations } from '../services/api';
import toast from 'react-hot-toast';
import { Loader } from '@googlemaps/js-api-loader';

const MapTrackingPage = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [geoFences, setGeoFences] = useState([]);
  const [liveLocations, setLiveLocations] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const mapLoadingRef = useRef(false);
  const geofenceCirclesRef = useRef([]);
  const liveMarkersRef = useRef([]);
  const geoFencesRef = useRef([]);
  const liveLocationsRef = useRef([]);
  const userIdRef = useRef(user?.id || null);
  const loaderRef = useRef(null);

  useEffect(() => {
    geoFencesRef.current = geoFences;
  }, [geoFences]);

  useEffect(() => {
    liveLocationsRef.current = liveLocations;
  }, [liveLocations]);

  useEffect(() => {
    userIdRef.current = user?.id || null;
  }, [user?.id]);

  const clearOverlays = (overlaysRef) => {
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];
  };

  const renderGeoFences = useCallback((map = mapInstanceRef.current) => {
    if (!map || !window.google?.maps) return;

    clearOverlays(geofenceCirclesRef);

    const zoneColor = (type) => {
      if (type === 'SAFE_ZONE') return '#16a34a';
      if (type === 'DANGER_ZONE') return '#dc2626';
      return '#f59e0b';
    };

    geoFencesRef.current.forEach((zone) => {
      if (typeof zone.latitude !== 'number' || typeof zone.longitude !== 'number') return;

      const circle = new window.google.maps.Circle({
        map,
        center: { lat: zone.latitude, lng: zone.longitude },
        radius: Number(zone.radius) || 0,
        strokeColor: zoneColor(zone.zoneType),
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: zoneColor(zone.zoneType),
        fillOpacity: 0.15,
      });

      geofenceCirclesRef.current.push(circle);
    });
  }, []);

  const renderLiveMarkers = useCallback((map = mapInstanceRef.current) => {
    if (!map || !window.google?.maps) return;

    clearOverlays(liveMarkersRef);

    const validLocations = liveLocationsRef.current.filter(
      (location) => typeof location.latitude === 'number' && typeof location.longitude === 'number'
    );

    if (!validLocations.length) return;

    const bounds = new window.google.maps.LatLngBounds();

    validLocations.forEach((location) => {
      const position = { lat: location.latitude, lng: location.longitude };
      const marker = new window.google.maps.Marker({
        map,
        position,
        title: location.touristName || `Tourist ${location.touristId}`,
      });

      liveMarkersRef.current.push(marker);
      bounds.extend(position);
    });

    if (validLocations.length > 1) {
      map.fitBounds(bounds);
    } else {
      map.setCenter(bounds.getCenter());
      map.setZoom(15);
    }
  }, []);

  const initMap = useCallback(async (initialLocation) => {
    if (!mapRef.current || mapInstanceRef.current || mapLoadingRef.current) return;

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      toast.error('Google Maps API key not configured');
      return;
    }

    try {
      mapLoadingRef.current = true;
      if (!loaderRef.current) {
        loaderRef.current = new Loader({
          apiKey,
          version: 'weekly',
        });
      }

      await loaderRef.current.load();

      const center = initialLocation || { lat: 20.5937, lng: 78.9629 };
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: initialLocation ? 15 : 5,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });

      mapInstanceRef.current = map;
      renderGeoFences(map);
      renderLiveMarkers(map);
    } catch (error) {
      toast.error('Failed to load Google Maps');
    } finally {
      mapLoadingRef.current = false;
    }
  }, [renderGeoFences, renderLiveMarkers]);

  const loadLiveLocations = useCallback(async () => {
    try {
      const response = await getLiveLocations();
      setLiveLocations(response.data || []);
    } catch (error) {
      toast.error('Failed to load live locations');
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          initMap({ lat: latitude, lng: longitude });

          try {
            if (user?.id) {
              await updateLocation({
                touristId: user.id,
                latitude,
                longitude,
              });
              await loadLiveLocations();
            }
          } catch (error) {
            console.error('Failed to update location:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to access your location');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [user, initMap, loadLiveLocations]);

  useEffect(() => {
    loadLiveLocations();
    const intervalId = setInterval(loadLiveLocations, 30000);
    return () => clearInterval(intervalId);
  }, [loadLiveLocations]);

  useEffect(() => {
    const fetchGeoFences = async () => {
      try {
        const response = await getAllGeoFences();
        setGeoFences(response.data || []);
      } catch (error) {
        toast.error('Failed to load geofences');
      }
    };

    fetchGeoFences();
    const intervalId = setInterval(fetchGeoFences, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      initMap(currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : undefined);
      return;
    }

    if (!currentLocation || liveLocations.length > 1) return;

    const map = mapInstanceRef.current;
    const position = { lat: currentLocation.latitude, lng: currentLocation.longitude };
    map.setCenter(position);
    map.setZoom(15);
  }, [currentLocation, liveLocations, initMap]);

  useEffect(() => {
    renderGeoFences();
  }, [renderGeoFences]);

  useEffect(() => {
    renderLiveMarkers();
  }, [renderLiveMarkers]);

  return (
    <div className="min-h-screen theme-bg text-black">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Live Map Tracking
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-[32rem] md:h-[42rem]">
                    <div ref={mapRef} className="h-full w-full" />
                  </div>
                  {!currentLocation && (
                    <div className="p-4 text-sm text-gray-600 bg-gray-50 border-t">
                      Enable location access to see your position on the map.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                  Live Tourist Locations
                </h2>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {liveLocations.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      No live location data available yet.
                    </p>
                  ) : (
                    liveLocations.map((location) => (
                      <div
                        key={location.touristId}
                        className="p-3 rounded-lg border border-blue-200 bg-blue-50"
                      >
                        <p className="font-semibold text-gray-800">
                          {location.touristName || `Tourist ${location.touristId}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          {Number(location.latitude).toFixed(4)},{' '}
                          {Number(location.longitude).toFixed(4)}
                        </p>
                        {location.timestamp && (
                          <p className="text-xs text-gray-500">
                            Updated: {new Date(location.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                  Safety Zones
                </h2>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {geoFences.length === 0 ? (
                    <p className="text-sm text-gray-600">No safety zones configured.</p>
                  ) : (
                    geoFences.map((zone) => (
                      <div
                        key={zone.id}
                        className={`p-3 rounded-lg border-2 ${
                          zone.zoneType === 'SAFE_ZONE'
                            ? 'border-green-500 bg-green-50'
                            : zone.zoneType === 'DANGER_ZONE'
                            ? 'border-red-500 bg-red-50'
                            : 'border-yellow-500 bg-yellow-50'
                        }`}
                      >
                        <p className="font-semibold text-gray-800">
                          {zone.zoneName}
                        </p>
                        <p className="text-xs text-gray-600">
                          Type: {zone.zoneType}
                        </p>
                        <p className="text-xs text-gray-600">
                          Radius: {zone.radius}m
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {currentLocation && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Your location is being tracked and updated regularly for safety monitoring.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapTrackingPage;
