package com.luxurylife.backend.controller;

import com.luxurylife.backend.dto.AuthLoginRequest;
import com.luxurylife.backend.dto.AuthRegisterRequest;
import com.luxurylife.backend.dto.AuthResponse;
import com.luxurylife.backend.model.User;
import com.luxurylife.backend.repository.UserRepository;
import com.luxurylife.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository users;
    private final JwtService jwt;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository users, JwtService jwt) {
        this.users = users;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody AuthRegisterRequest req) {
        if (users.existsByEmail(req.email)) {
            throw new RuntimeException("Email already used");
        }

        User u = new User(req.email, encoder.encode(req.password));
        u.setRole("USER");

        users.save(u);

        String token = jwt.createToken(u.getId(), u.getEmail(), u.getRole());
        return new AuthResponse(token, u.getId(), u.getEmail());
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthLoginRequest req) {
        User u = users.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("Invalid login"));

        if (!encoder.matches(req.password, u.getPasswordHash())) {
            throw new RuntimeException("Invalid login");
        }

        String token = jwt.createToken(u.getId(), u.getEmail(), u.getRole());
        return new AuthResponse(token, u.getId(), u.getEmail());
    }
}
