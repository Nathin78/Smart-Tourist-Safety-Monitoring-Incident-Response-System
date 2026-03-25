package com.touristsafety.service;

import com.touristsafety.dto.LiveLocationDTO;
import com.touristsafety.dto.LocationUpdateDTO;
import com.touristsafety.entity.Location;
import com.touristsafety.entity.Tourist;
import com.touristsafety.exception.ResourceNotFoundException;
import com.touristsafety.repository.LocationRepository;
import com.touristsafety.repository.TouristRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private TouristRepository touristRepository;

    public Location updateLocation(LocationUpdateDTO locationDTO) {
        Long touristId = Objects.requireNonNull(locationDTO.getTouristId(), "touristId must not be null");
        Tourist tourist = touristRepository.findById(touristId)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));

        Location location = new Location();
        location.setTourist(tourist);
        location.setLatitude(locationDTO.getLatitude());
        location.setLongitude(locationDTO.getLongitude());

        return locationRepository.save(location);
    }

    public List<Location> getTouristLocationHistory(Long touristId) {
        return locationRepository.findByTouristId(touristId);
    }

    public Location getLatestTouristLocation(Long touristId) {
        touristId = Objects.requireNonNull(touristId, "touristId must not be null");
        touristRepository.findById(touristId)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));
        
        Location location = locationRepository.findLatestLocationByTouristId(touristId);
        if (location == null) {
            throw new ResourceNotFoundException("No location data found for tourist");
        }
        return location;
    }

    public List<LiveLocationDTO> getLiveLocations(boolean isAdmin, Long currentUserId) {
        if (isAdmin) {
            List<LiveLocationDTO> liveLocations = new ArrayList<>();
            for (Tourist tourist : touristRepository.findAll()) {
                Location latestLocation = locationRepository.findLatestLocationByTouristId(tourist.getId());
                if (latestLocation != null) {
                    liveLocations.add(toLiveLocationDTO(tourist, latestLocation));
                }
            }
            return liveLocations;
        }

        Tourist tourist = touristRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));
        Location latestLocation = locationRepository.findLatestLocationByTouristId(currentUserId);
        if (latestLocation == null) {
            return Collections.emptyList();
        }

        return Collections.singletonList(toLiveLocationDTO(tourist, latestLocation));
    }

    private LiveLocationDTO toLiveLocationDTO(Tourist tourist, Location location) {
        return new LiveLocationDTO(
                tourist.getId(),
                tourist.getName(),
                tourist.getEmail(),
                location.getLatitude(),
                location.getLongitude(),
                location.getTimestamp()
        );
    }
}
