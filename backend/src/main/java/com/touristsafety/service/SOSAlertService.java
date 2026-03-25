package com.touristsafety.service;

import com.touristsafety.dto.SOSAlertDTO;
import com.touristsafety.entity.SOSAlert;
import com.touristsafety.entity.Tourist;
import com.touristsafety.exception.ResourceNotFoundException;
import com.touristsafety.repository.SOSAlertRepository;
import com.touristsafety.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class SOSAlertService {

    @Autowired
    private SOSAlertRepository sosAlertRepository;

    @Autowired
    private TouristRepository touristRepository;

    @Autowired
    private MailService mailService;

    public SOSAlert createSOSAlert(SOSAlertDTO sosAlertDTO) {
        Long touristId = Objects.requireNonNull(sosAlertDTO.getTouristId(), "touristId must not be null");
        Tourist tourist = touristRepository.findById(touristId)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));

        SOSAlert sosAlert = new SOSAlert();
        sosAlert.setTourist(tourist);
        sosAlert.setLatitude(sosAlertDTO.getLatitude());
        sosAlert.setLongitude(sosAlertDTO.getLongitude());
        sosAlert.setStatus("ACTIVE");

        SOSAlert saved = sosAlertRepository.save(sosAlert);

        String subject = "SOS Alert Triggered";
        String body = String.format("Tourist: %s (%s)%nLocation: %s, %s%nStatus: %s%nAlert ID: %d",
                tourist.getName(),
                tourist.getEmail(),
                sosAlertDTO.getLatitude(),
                sosAlertDTO.getLongitude(),
                saved.getStatus(),
                saved.getId());
        String recipient = firstNonBlank(tourist.getSosEmail(), tourist.getEmail());
        mailService.sendAlert(recipient, subject, body);

        return saved;
    }

    private String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }

        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }

        return null;
    }

    public List<SOSAlert> getTouristSOSAlerts(Long touristId) {
        return sosAlertRepository.findByTouristId(touristId);
    }

    public List<SOSAlert> getActiveSOSAlerts() {
        return sosAlertRepository.findByStatus("ACTIVE");
    }

    public List<SOSAlert> getAllSOSAlerts() {
        return sosAlertRepository.findAll();
    }

    public SOSAlert getSOSAlertById(Long id) {
        id = Objects.requireNonNull(id, "id must not be null");
        return sosAlertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SOS Alert not found"));
    }

    public SOSAlert resolveSOSAlert(Long sosAlertId, String notes) {
        sosAlertId = Objects.requireNonNull(sosAlertId, "sosAlertId must not be null");
        SOSAlert sosAlert = sosAlertRepository.findById(sosAlertId)
                .orElseThrow(() -> new ResourceNotFoundException("SOS Alert not found"));

        sosAlert.setStatus("RESOLVED");
        sosAlert.setResolvedNotes(notes);

        return sosAlertRepository.save(sosAlert);
    }
}
