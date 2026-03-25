package com.touristsafety.controller;

import com.touristsafety.dto.IncidentReportDTO;
import com.touristsafety.entity.Incident;
import com.touristsafety.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*", maxAge = 3600)
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @PostMapping("/report")
    public ResponseEntity<?> reportIncident(@RequestBody IncidentReportDTO reportDTO, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            Long currentUserId = (Long) authentication.getPrincipal();
            if (!isAdmin && reportDTO != null && reportDTO.getTouristId() != null
                    && !reportDTO.getTouristId().equals(currentUserId)) {
                return ResponseEntity.status(403).body("Forbidden");
            }

            Incident incident = incidentService.reportIncident(reportDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(incident);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Report failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllIncidents() {
        try {
            List<Incident> incidents = incidentService.getAllIncidents();
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/tourist/{touristId}")
    public ResponseEntity<?> getTouristIncidents(@PathVariable Long touristId, Authentication authentication) {
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

            List<Incident> incidents = incidentService.getTouristIncidents(touristId);
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/open")
    public ResponseEntity<?> getOpenIncidents() {
        try {
            List<Incident> incidents = incidentService.getOpenIncidents();
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getIncidentById(@PathVariable Long id) {
        try {
            Incident incident = incidentService.getIncidentById(id);
            return ResponseEntity.ok(incident);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Incident not found");
        }
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<?> resolveIncident(@PathVariable Long id) {
        try {
            Incident incident = incidentService.resolveIncident(id);
            return ResponseEntity.ok(incident);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }
}
