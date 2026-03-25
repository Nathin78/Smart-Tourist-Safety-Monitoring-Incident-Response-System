package com.touristsafety.repository;

import com.touristsafety.entity.GeoFence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeoFenceRepository extends JpaRepository<GeoFence, Long> {
    List<GeoFence> findByZoneType(String zoneType);
    List<GeoFence> findByIsActive(Boolean isActive);
}
