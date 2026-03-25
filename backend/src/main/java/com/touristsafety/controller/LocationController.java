package com.touristsafety.controller;

import com.touristsafety.dto.LiveLocationDTO;
import com.touristsafety.dto.LocationUpdateDTO;
import com.touristsafety.entity.Location;
import com.touristsafety.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping("/update")
    public ResponseEntity<?> updateLocation(@RequestBody LocationUpdateDTO locationDTO, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            Long currentUserId = (Long) authentication.getPrincipal();
            if (!isAdmin && locationDTO != null && locationDTO.getTouristId() != null
                    && !locationDTO.getTouristId().equals(currentUserId)) {
                return ResponseEntity.status(403).body("Forbidden");
            }

            Location location = locationService.updateLocation(locationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(location);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Location update failed: " + e.getMessage());
        }
    }

    @GetMapping("/history/{touristId}")
    public ResponseEntity<?> getLocationHistory(@PathVariable Long touristId, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            Long currentUserId = (Long) authentication.getPrincipal();
            if (!isAdmin && !touristId.equals(currentUserId)) {
                return ResponseEntity.status(403).body("Forbidden");
            }

            List<Location> locations = locationService.getTouristLocationHistory(touristId);
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/latest/{touristId}")
    public ResponseEntity<?> getLatestLocation(@PathVariable Long touristId, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            Long currentUserId = (Long) authentication.getPrincipal();
            if (!isAdmin && !touristId.equals(currentUserId)) {
                return ResponseEntity.status(403).body("Forbidden");
            }

            Location location = locationService.getLatestTouristLocation(touristId);
            return ResponseEntity.ok(location);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/live")
    public ResponseEntity<?> getLiveLocations(Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            Long currentUserId = (Long) authentication.getPrincipal();

            List<LiveLocationDTO> liveLocations = locationService.getLiveLocations(isAdmin, currentUserId);
            return ResponseEntity.ok(liveLocations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }
}
