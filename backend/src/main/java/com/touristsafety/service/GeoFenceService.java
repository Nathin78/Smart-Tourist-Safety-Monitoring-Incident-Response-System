package com.touristsafety.service;

import com.touristsafety.entity.GeoFence;
import com.touristsafety.exception.ResourceNotFoundException;
import com.touristsafety.repository.GeoFenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class GeoFenceService {

    @Autowired
    private GeoFenceRepository geoFenceRepository;

    public GeoFence createGeoFence(GeoFence geoFence) {
        geoFence = Objects.requireNonNull(geoFence, "geoFence must not be null");
        return geoFenceRepository.save(geoFence);
    }

    public List<GeoFence> getAllGeoFences() {
        return geoFenceRepository.findAll();
    }

    public List<GeoFence> getActiveGeoFences() {
        return geoFenceRepository.findByIsActive(true);
    }

    public List<GeoFence> getGeoFencesByType(String zoneType) {
        return geoFenceRepository.findByZoneType(zoneType);
    }

    public GeoFence getGeoFenceById(Long id) {
        id = Objects.requireNonNull(id, "id must not be null");
        return geoFenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GeoFence not found"));
    }

    public GeoFence updateGeoFence(Long id, GeoFence updates) {
        id = Objects.requireNonNull(id, "id must not be null");
        updates = Objects.requireNonNull(updates, "updates must not be null");
        GeoFence geoFence = geoFenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GeoFence not found"));
        Objects.requireNonNull(geoFence, "geoFence must not be null after lookup");

        if (updates.getZoneName() != null) {
            geoFence.setZoneName(updates.getZoneName());
        }
        if (updates.getLatitude() != null) {
            geoFence.setLatitude(updates.getLatitude());
        }
        if (updates.getLongitude() != null) {
            geoFence.setLongitude(updates.getLongitude());
        }
        if (updates.getRadius() != null) {
            geoFence.setRadius(updates.getRadius());
        }
        if (updates.getZoneType() != null) {
            geoFence.setZoneType(updates.getZoneType());
        }
        if (updates.getIsActive() != null) {
            geoFence.setIsActive(updates.getIsActive());
        }

        return geoFenceRepository.save(geoFence);
    }

    public void deleteGeoFence(Long id) {
        id = Objects.requireNonNull(id, "id must not be null");
        geoFenceRepository.deleteById(id);
    }
}
