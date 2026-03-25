package com.touristsafety.controller;

import com.touristsafety.entity.GeoFence;
import com.touristsafety.service.GeoFenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geofences")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GeoFenceController {

    @Autowired
    private GeoFenceService geoFenceService;

    @PostMapping
    public ResponseEntity<?> createGeoFence(@RequestBody GeoFence geoFence) {
        try {
            GeoFence created = geoFenceService.createGeoFence(geoFence);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Creation failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllGeoFences() {
        try {
            List<GeoFence> geoFences = geoFenceService.getAllGeoFences();
            return ResponseEntity.ok(geoFences);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveGeoFences() {
        try {
            List<GeoFence> geoFences = geoFenceService.getActiveGeoFences();
            return ResponseEntity.ok(geoFences);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/type/{zoneType}")
    public ResponseEntity<?> getGeoFencesByType(@PathVariable String zoneType) {
        try {
            List<GeoFence> geoFences = geoFenceService.getGeoFencesByType(zoneType);
            return ResponseEntity.ok(geoFences);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGeoFenceById(@PathVariable Long id) {
        try {
            GeoFence geoFence = geoFenceService.getGeoFenceById(id);
            return ResponseEntity.ok(geoFence);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("GeoFence not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGeoFence(@PathVariable Long id, @RequestBody GeoFence updates) {
        try {
            GeoFence updated = geoFenceService.updateGeoFence(id, updates);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGeoFence(@PathVariable Long id) {
        try {
            geoFenceService.deleteGeoFence(id);
            return ResponseEntity.ok("GeoFence deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }
}
