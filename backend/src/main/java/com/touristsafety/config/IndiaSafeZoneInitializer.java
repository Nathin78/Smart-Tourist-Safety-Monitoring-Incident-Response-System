package com.touristsafety.config;

import com.touristsafety.entity.GeoFence;
import com.touristsafety.repository.GeoFenceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class IndiaSafeZoneInitializer {

    @Bean
    CommandLineRunner seedIndiaSafeZones(GeoFenceRepository geoFenceRepository) {
        return args -> {
            Set<String> existingNames = geoFenceRepository.findAll().stream()
                    .map(GeoFence::getZoneName)
                    .map(IndiaSafeZoneInitializer::normalize)
                    .collect(Collectors.toSet());

            List<GeoFence> safeZones = buildSafeZones();
            List<GeoFence> missingZones = new ArrayList<>();

            for (GeoFence zone : safeZones) {
                if (!existingNames.contains(normalize(zone.getZoneName()))) {
                    missingZones.add(zone);
                }
            }

            if (!missingZones.isEmpty()) {
                geoFenceRepository.saveAll(missingZones);
                System.out.println("Seeded " + missingZones.size() + " India safe zones");
            }
        };
    }

    private static List<GeoFence> buildSafeZones() {
        List<GeoFence> zones = new ArrayList<>();

        zones.add(safeZone("Safe Zone - Taj Mahal, Agra", 27.1751, 78.0421, 1800));
        zones.add(safeZone("Safe Zone - Agra Fort, Agra", 27.1795, 78.0211, 1500));
        zones.add(safeZone("Safe Zone - India Gate, New Delhi", 28.6129, 77.2295, 2000));
        zones.add(safeZone("Safe Zone - Red Fort, Delhi", 28.6562, 77.2410, 1800));
        zones.add(safeZone("Safe Zone - Qutub Minar, Delhi", 28.5244, 77.1855, 1800));
        zones.add(safeZone("Safe Zone - Jaipur City Palace, Jaipur", 26.9258, 75.8231, 1800));
        zones.add(safeZone("Safe Zone - Hawa Mahal, Jaipur", 26.9239, 75.8267, 1500));
        zones.add(safeZone("Safe Zone - Udaipur City Palace, Udaipur", 24.5761, 73.6802, 1800));
        zones.add(safeZone("Safe Zone - Gateway of India, Mumbai", 18.9220, 72.8347, 1800));
        zones.add(safeZone("Safe Zone - Marine Drive, Mumbai", 18.9440, 72.8236, 2500));
        zones.add(safeZone("Safe Zone - Sabarmati Ashram, Ahmedabad", 23.0568, 72.5800, 2000));
        zones.add(safeZone("Safe Zone - Baga Beach, Goa", 15.5553, 73.7519, 2200));
        zones.add(safeZone("Safe Zone - Alappuzha Backwaters, Kerala", 9.4981, 76.3388, 2500));
        zones.add(safeZone("Safe Zone - Munnar Tea Gardens, Kerala", 10.0889, 77.0595, 2500));
        zones.add(safeZone("Safe Zone - Mysore Palace, Mysuru", 12.3052, 76.6551, 1800));
        zones.add(safeZone("Safe Zone - Hampi Heritage Zone, Karnataka", 15.3350, 76.4600, 3000));
        zones.add(safeZone("Safe Zone - Mahabodhi Temple, Bodh Gaya", 24.6950, 84.9912, 1800));
        zones.add(safeZone("Safe Zone - Assi Ghat, Varanasi", 25.2819, 82.9933, 2200));
        zones.add(safeZone("Safe Zone - Victoria Memorial, Kolkata", 22.5448, 88.3426, 1800));
        zones.add(safeZone("Safe Zone - Konark Sun Temple, Odisha", 19.8876, 86.0945, 2200));
        zones.add(safeZone("Safe Zone - Charminar, Hyderabad", 17.3616, 78.4747, 1800));
        zones.add(safeZone("Safe Zone - Marina Beach, Chennai", 13.0500, 80.2824, 2600));
        zones.add(safeZone("Safe Zone - Golden Temple, Amritsar", 31.6200, 74.8765, 1800));
        zones.add(safeZone("Safe Zone - Shimla Mall Road, Shimla", 31.1048, 77.1710, 2200));
        zones.add(safeZone("Safe Zone - Rishikesh Laxman Jhula, Rishikesh", 30.1287, 78.3306, 2200));
        zones.add(safeZone("Safe Zone - Gangtok MG Marg, Gangtok", 27.3314, 88.6130, 1800));
        zones.add(safeZone("Safe Zone - Leh Main Market, Leh", 34.1670, 77.5840, 2200));
        zones.add(safeZone("Safe Zone - Tawang Monastery, Tawang", 27.5860, 91.8650, 2500));
        zones.add(safeZone("Safe Zone - Port Blair Cellular Jail, Andaman", 11.6234, 92.7265, 2200));
        zones.add(safeZone("Safe Zone - Shillong Ward's Lake, Meghalaya", 25.5748, 91.8844, 1800));
        zones.add(safeZone("Safe Zone - Khajuraho Temples, Madhya Pradesh", 24.8318, 79.9199, 2200));

        return zones;
    }

    private static GeoFence safeZone(String zoneName, double latitude, double longitude, double radiusMeters) {
        GeoFence geoFence = new GeoFence();
        geoFence.setZoneName(zoneName);
        geoFence.setLatitude(latitude);
        geoFence.setLongitude(longitude);
        geoFence.setRadius(radiusMeters);
        geoFence.setZoneType("SAFE_ZONE");
        geoFence.setIsActive(true);
        return geoFence;
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
