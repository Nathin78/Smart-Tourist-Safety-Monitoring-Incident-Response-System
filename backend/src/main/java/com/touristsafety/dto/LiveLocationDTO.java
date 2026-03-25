package com.touristsafety.dto;

import java.util.Date;

public class LiveLocationDTO {
    private Long touristId;
    private String touristName;
    private String email;
    private Double latitude;
    private Double longitude;
    private Date timestamp;

    public LiveLocationDTO(Long touristId, String touristName, String email, Double latitude, Double longitude, Date timestamp) {
        this.touristId = touristId;
        this.touristName = touristName;
        this.email = email;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }

    public Long getTouristId() {
        return touristId;
    }

    public void setTouristId(Long touristId) {
        this.touristId = touristId;
    }

    public String getTouristName() {
        return touristName;
    }

    public void setTouristName(String touristName) {
        this.touristName = touristName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
