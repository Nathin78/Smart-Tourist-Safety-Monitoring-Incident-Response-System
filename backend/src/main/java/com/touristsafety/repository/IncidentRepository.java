package com.touristsafety.repository;

import com.touristsafety.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByTouristId(Long touristId);
    List<Incident> findByStatus(String status);
    List<Incident> findByTouristIdAndStatus(Long touristId, String status);
}
