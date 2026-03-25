package com.touristsafety.repository;

import com.touristsafety.entity.Tourist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TouristRepository extends JpaRepository<Tourist, Long> {
    Optional<Tourist> findByEmail(String email);
    Optional<Tourist> findByPassportNumber(String passportNumber);
    boolean existsByEmail(String email);
}
