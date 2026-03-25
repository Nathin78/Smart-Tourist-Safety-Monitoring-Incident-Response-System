package com.touristsafety.controller;

import com.touristsafety.dto.SOSAlertDTO;
import com.touristsafety.entity.SOSAlert;
import com.touristsafety.service.SOSAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SOSAlertController {

    @Autowired
    private SOSAlertService sosAlertService;

    @PostMapping
    public ResponseEntity<?> createSOSAlert(@RequestBody SOSAlertDTO sosAlertDTO, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            Long currentUserId = (Long) authentication.getPrincipal();
            if (sosAlertDTO == null) {
                sosAlertDTO = new SOSAlertDTO();
            }

            if (isAdmin) {
                if (sosAlertDTO.getTouristId() == null) {
                    return ResponseEntity.status(400).body("touristId is required for admin requests");
                }
            } else {
                if (sosAlertDTO.getTouristId() != null && !sosAlertDTO.getTouristId().equals(currentUserId)) {
                    return ResponseEntity.status(403).body("Forbidden");
                }
                // Always bind SOS to the logged-in user for non-admins
                sosAlertDTO.setTouristId(currentUserId);
            }

            SOSAlert sosAlert = sosAlertService.createSOSAlert(sosAlertDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(sosAlert);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("SOS alert failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSOSAlerts() {
        try {
            List<SOSAlert> sosAlerts = sosAlertService.getAllSOSAlerts();
            return ResponseEntity.ok(sosAlerts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveSOSAlerts() {
        try {
            List<SOSAlert> sosAlerts = sosAlertService.getActiveSOSAlerts();
            return ResponseEntity.ok(sosAlerts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/tourist/{touristId}")
    public ResponseEntity<?> getTouristSOSAlerts(@PathVariable Long touristId, Authentication authentication) {
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

            List<SOSAlert> sosAlerts = sosAlertService.getTouristSOSAlerts(touristId);
            return ResponseEntity.ok(sosAlerts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSOSAlertById(@PathVariable Long id) {
        try {
            SOSAlert sosAlert = sosAlertService.getSOSAlertById(id);
            return ResponseEntity.ok(sosAlert);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("SOS Alert not found");
        }
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<?> resolveSOSAlert(@PathVariable Long id, @RequestParam(required = false) String notes) {
        try {
            SOSAlert sosAlert = sosAlertService.resolveSOSAlert(id, notes);
            return ResponseEntity.ok(sosAlert);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: " + e.getMessage());
        }
    }
}
