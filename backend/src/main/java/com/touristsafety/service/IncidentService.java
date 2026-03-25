package com.touristsafety.service;

import com.touristsafety.dto.IncidentReportDTO;
import com.touristsafety.entity.Incident;
import com.touristsafety.entity.Tourist;
import com.touristsafety.exception.ResourceNotFoundException;
import com.touristsafety.repository.IncidentRepository;
import com.touristsafety.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private TouristRepository touristRepository;

    public Incident reportIncident(IncidentReportDTO reportDTO) {
        Long touristId = Objects.requireNonNull(reportDTO.getTouristId(), "touristId must not be null");
        Tourist tourist = touristRepository.findById(touristId)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));

        Incident incident = new Incident();
        incident.setTourist(tourist);
        incident.setType(reportDTO.getType());
        incident.setDescription(reportDTO.getDescription());
        incident.setLatitude(reportDTO.getLatitude());
        incident.setLongitude(reportDTO.getLongitude());
        incident.setStatus("OPEN");

        return incidentRepository.save(incident);
    }

    public List<Incident> getTouristIncidents(Long touristId) {
        return incidentRepository.findByTouristId(touristId);
    }

    public List<Incident> getOpenIncidents() {
        return incidentRepository.findByStatus("OPEN");
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        Objects.requireNonNull(id, "id must not be null");
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));
    }

    public Incident resolveIncident(Long incidentId) {
        Objects.requireNonNull(incidentId, "incidentId must not be null");
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        incident.setStatus("RESOLVED");
        incident.setResolvedAt(new Date());

        return incidentRepository.save(incident);
    }
}
