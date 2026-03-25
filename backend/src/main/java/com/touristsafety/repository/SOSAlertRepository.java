package com.touristsafety.repository;

import com.touristsafety.entity.SOSAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SOSAlertRepository extends JpaRepository<SOSAlert, Long> {
    List<SOSAlert> findByTouristId(Long touristId);
    List<SOSAlert> findByStatus(String status);
}
