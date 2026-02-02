package com.luxurylife.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthRegisterRequest {
    @Email @NotBlank
    public String email;

    @NotBlank
    public String password;
}
