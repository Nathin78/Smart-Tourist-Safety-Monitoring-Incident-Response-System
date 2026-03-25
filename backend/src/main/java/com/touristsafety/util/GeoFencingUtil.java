package com.touristsafety.util;

public class GeoFencingUtil {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param lat1 Latitude of point 1
     * @param lon1 Longitude of point 1
     * @param lat2 Latitude of point 2
     * @param lon2 Longitude of point 2
     * @return Distance in meters
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distanceKm = EARTH_RADIUS_KM * c;
        
        return distanceKm * 1000; // Convert to meters
    }

    /**
     * Check if a point is within a geofence
     * @param pointLat Latitude of the point
     * @param pointLon Longitude of the point
     * @param centerLat Latitude of geofence center
     * @param centerLon Longitude of geofence center
     * @param radiusMeters Radius of geofence in meters
     * @return true if point is within geofence
     */
    public static boolean isWithinGeofence(double pointLat, double pointLon, 
                                          double centerLat, double centerLon, double radiusMeters) {
        double distance = calculateDistance(pointLat, pointLon, centerLat, centerLon);
        return distance <= radiusMeters;
    }
}
