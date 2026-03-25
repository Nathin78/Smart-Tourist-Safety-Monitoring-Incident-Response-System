package com.touristsafety.dto;

public class AuthResponseDTO {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String sosEmail;
    private String token;
    private String message;

    public AuthResponseDTO(Long id, String email, String name, String role, String sosEmail, String token, String message) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.sosEmail = sosEmail;
        this.token = token;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSosEmail() {
        return sosEmail;
    }

    public void setSosEmail(String sosEmail) {
        this.sosEmail = sosEmail;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
