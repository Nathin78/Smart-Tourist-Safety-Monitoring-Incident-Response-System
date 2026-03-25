package com.touristsafety.controller;

import com.touristsafety.dto.TouristResponseDTO;
import com.touristsafety.service.TouristService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tourists")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TouristController {

    @Autowired
    private TouristService touristService;

    @GetMapping
    public ResponseEntity<?> getAllTourists() {
        try {
            List<TouristResponseDTO> tourists = touristService.getAllTourists();
            return ResponseEntity.ok(tourists);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTouristById(@PathVariable Long id, Authentication authentication) {
        try {
            if (authentication == null || authentication.getPrincipal() == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            Long currentUserId = (Long) authentication.getPrincipal();
            if (!isAdmin && !id.equals(currentUserId)) {
                return ResponseEntity.status(403).body("Forbidden");
            }

            TouristResponseDTO tourist = touristService.getTouristById(id);
            return ResponseEntity.ok(tourist);
        } catch (Exception e) {
            return ResponseEntity.status(404)
                    .body("Tourist not found");
        }
    }
}
