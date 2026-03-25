package com.touristsafety.controller;

import com.touristsafety.dto.AuthResponseDTO;
import com.touristsafety.dto.TouristLoginDTO;
import com.touristsafety.dto.TouristRegistrationDTO;
import com.touristsafety.dto.TouristResponseDTO;
import com.touristsafety.exception.UnauthorizedException;
import com.touristsafety.service.TouristService;
import com.touristsafety.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private TouristService touristService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody TouristRegistrationDTO registrationDTO) {
        try {
            TouristResponseDTO tourist = touristService.register(registrationDTO);
            String token = jwtTokenProvider.generateToken(tourist.getId(), tourist.getEmail(), tourist.getRole());
            AuthResponseDTO response = new AuthResponseDTO(
                    tourist.getId(),
                    tourist.getEmail(),
                    tourist.getName(),
                    tourist.getRole(),
                    tourist.getSosEmail(),
                    token,
                    "Registration successful"
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.warn("Registration failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody TouristLoginDTO loginDTO) {
        try {
            String token = touristService.login(loginDTO);
            TouristResponseDTO tourist = touristService.getTouristById(
                    jwtTokenProvider.getUserIdFromToken(token)
            );
            AuthResponseDTO response = new AuthResponseDTO(
                    tourist.getId(),
                    tourist.getEmail(),
                    tourist.getName(),
                    tourist.getRole(),
                    tourist.getSosEmail(),
                    token,
                    "Login successful"
            );
            return ResponseEntity.ok(response);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Login failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Login failed due to server error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: server error (check backend logs)");
        }
    }
}
