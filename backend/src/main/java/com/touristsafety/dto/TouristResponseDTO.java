package com.touristsafety.dto;

public class TouristResponseDTO {
    private Long id;
    private String name;
    private String passportNumber;
    private String country;
    private String phone;
    private String emergencyContact;
    private String sosEmail;
    private String email;
    private Boolean isActive;
    private String role;

    public TouristResponseDTO(Long id, String name, String passportNumber, String country, 
                            String phone, String emergencyContact, String sosEmail, String email, Boolean isActive, String role) {
        this.id = id;
        this.name = name;
        this.passportNumber = passportNumber;
        this.country = country;
        this.phone = phone;
        this.emergencyContact = emergencyContact;
        this.sosEmail = sosEmail;
        this.email = email;
        this.isActive = isActive;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getSosEmail() {
        return sosEmail;
    }

    public void setSosEmail(String sosEmail) {
        this.sosEmail = sosEmail;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
