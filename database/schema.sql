-- Create Database
CREATE DATABASE IF NOT EXISTS tourist_safety;
USE tourist_safety;

-- Tourist Table
CREATE TABLE tourists (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    passport_number VARCHAR(50) NOT NULL UNIQUE,
    country VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20),
    sos_email VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_passport (passport_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Location Table
CREATE TABLE locations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tourist_id BIGINT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tourist_id) REFERENCES tourists(id) ON DELETE CASCADE,
    INDEX idx_tourist_timestamp (tourist_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Incident Table
CREATE TABLE incidents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tourist_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (tourist_id) REFERENCES tourists(id) ON DELETE CASCADE,
    INDEX idx_tourist_status (tourist_id, status),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- GeoFence Table
CREATE TABLE geofences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    zone_name VARCHAR(100) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    radius DOUBLE NOT NULL,
    zone_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_zone_type (zone_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SOS Alert Table
CREATE TABLE sos_alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tourist_id BIGINT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    resolved_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tourist_id) REFERENCES tourists(id) ON DELETE CASCADE,
    INDEX idx_tourist_status (tourist_id, status),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data
INSERT INTO geofences (zone_name, latitude, longitude, radius, zone_type, is_active) VALUES
('Taj Mahal', 27.1751, 78.0421, 500, 'SAFE_ZONE', TRUE),
('Jama Masjid Area', 28.6505, 77.2308, 1000, 'DANGER_ZONE', TRUE),
('Airport Restricted Zone', 28.5562, 77.1000, 2000, 'RESTRICTED_ZONE', TRUE),
('Central Park', 40.7829, -73.9654, 300, 'SAFE_ZONE', TRUE),
('Times Square', 40.7580, -73.9855, 500, 'DANGER_ZONE', TRUE);

-- Create admin user (password: admin123)
INSERT INTO tourists (name, passport_number, country, phone, sos_email, email, password, is_active) VALUES
('Admin User', 'ADMIN001', 'USA', '+1234567890', 'admin@touristsafety.com', 'admin@touristsafety.com', '$2a$10$5r7xVgGEJc2HhjXh9j7H0uKp/vLZjWN2gzENxBJSHEqhZMqS8wWhK', TRUE);

COMMIT;
