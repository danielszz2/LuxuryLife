package com.luxurylife.backend.dto;

public class AuthResponse {
    public String token;
    public Long userId;
    public String email;

    public AuthResponse(String token, Long userId, String email) {
        this.token = token;
        this.userId = userId;
        this.email = email;
    }
}
