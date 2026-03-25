package com.touristsafety.repository;

import com.touristsafety.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByTouristId(Long touristId);
    
    @Query(value = "SELECT * FROM locations WHERE tourist_id = :touristId ORDER BY timestamp DESC LIMIT 1", 
           nativeQuery = true)
    Location findLatestLocationByTouristId(@Param("touristId") Long touristId);
}
