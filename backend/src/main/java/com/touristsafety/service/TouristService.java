package com.touristsafety.service;

import com.touristsafety.dto.TouristLoginDTO;
import com.touristsafety.dto.TouristRegistrationDTO;
import com.touristsafety.dto.TouristResponseDTO;
import com.touristsafety.entity.Role;
import com.touristsafety.entity.Tourist;
import com.touristsafety.exception.DuplicateResourceException;
import com.touristsafety.exception.ResourceNotFoundException;
import com.touristsafety.exception.UnauthorizedException;
import com.touristsafety.repository.TouristRepository;
import com.touristsafety.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TouristService {

    @Autowired
    private TouristRepository touristRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private MailService mailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public TouristResponseDTO register(TouristRegistrationDTO registrationDTO) {
        if (touristRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        Tourist tourist = new Tourist();
        tourist.setName(registrationDTO.getName());
        tourist.setPassportNumber(registrationDTO.getPassportNumber());
        tourist.setCountry(registrationDTO.getCountry());
        tourist.setPhone(registrationDTO.getPhone());
        tourist.setEmergencyContact(registrationDTO.getEmergencyContact());
        tourist.setSosEmail(
                registrationDTO.getSosEmail() != null && !registrationDTO.getSosEmail().isBlank()
                        ? registrationDTO.getSosEmail().trim()
                        : registrationDTO.getEmail()
        );
        tourist.setEmail(registrationDTO.getEmail());
        tourist.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        tourist.setIsActive(true);
        tourist.setRole(Role.USER);

        Tourist savedTourist = touristRepository.save(tourist);
        mailService.sendWelcomeEmail(savedTourist.getEmail(), savedTourist.getName());
        return convertToResponseDTO(savedTourist);
    }

    public String login(TouristLoginDTO loginDTO) {
        Optional<Tourist> touristOpt = touristRepository.findByEmail(loginDTO.getEmail());
        
        if (touristOpt.isEmpty()) {
            throw new UnauthorizedException("Invalid email or password");
        }

        Tourist tourist = touristOpt.get();

        if (!passwordEncoder.matches(loginDTO.getPassword(), tourist.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!tourist.getIsActive()) {
            throw new UnauthorizedException("Account is inactive");
        }

        if (tourist.getRole() == null) {
            tourist.setRole(Role.USER);
            touristRepository.save(tourist);
        }

        return jwtTokenProvider.generateToken(
                tourist.getId(),
                tourist.getEmail(),
                tourist.getRole() != null ? tourist.getRole().name() : Role.USER.name()
        );
    }

    public TouristResponseDTO getTouristById(Long id) {
        Objects.requireNonNull(id, "id must not be null");
        Tourist tourist = touristRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));
        return convertToResponseDTO(tourist);
    }

    public List<TouristResponseDTO> getAllTourists() {
        return touristRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public TouristResponseDTO updateTourist(Long id, TouristRegistrationDTO updates) {
        Objects.requireNonNull(id, "id must not be null");
        Objects.requireNonNull(updates, "updates must not be null");
        Tourist tourist = touristRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));

        if (updates.getName() != null) {
            tourist.setName(updates.getName());
        }
        if (updates.getCountry() != null) {
            tourist.setCountry(updates.getCountry());
        }
        if (updates.getPhone() != null) {
            tourist.setPhone(updates.getPhone());
        }
        if (updates.getEmergencyContact() != null) {
            tourist.setEmergencyContact(updates.getEmergencyContact());
        }
        if (updates.getSosEmail() != null) {
            tourist.setSosEmail(updates.getSosEmail());
        }

        Objects.requireNonNull(tourist, "tourist must not be null");
        Tourist updatedTourist = touristRepository.save(tourist);
        return convertToResponseDTO(updatedTourist);
    }

    public void deactivateTourist(Long id) {
        Objects.requireNonNull(id, "id must not be null");
        Tourist tourist = touristRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));
        tourist.setIsActive(false);
        Objects.requireNonNull(tourist, "tourist must not be null");
        touristRepository.save(tourist);
    }

    private TouristResponseDTO convertToResponseDTO(Tourist tourist) {
        return new TouristResponseDTO(
                tourist.getId(),
                tourist.getName(),
                tourist.getPassportNumber(),
                tourist.getCountry(),
                tourist.getPhone(),
                tourist.getEmergencyContact(),
                tourist.getSosEmail(),
                tourist.getEmail(),
                tourist.getIsActive(),
                tourist.getRole() != null ? tourist.getRole().name() : null
        );
    }
}
