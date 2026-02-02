package com.luxurylife.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final Key key;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expirationMs:604800000}") long expirationMs
    ) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("jwt.secret must be at least 32 characters");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * ✅ Create JWT with email + role.
     * role should be "ADMIN" or "USER" (without ROLE_ prefix).
     */
    public String createToken(Long userId, String email, String role) {
        String safeRole = (role == null || role.isBlank()) ? "USER" : role.trim();

        // If someone passes "ROLE_ADMIN", store "ADMIN" in JWT for frontend clarity
        if (safeRole.startsWith("ROLE_")) {
            safeRole = safeRole.substring("ROLE_".length());
        }

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", safeRole) // ✅ frontend reads this
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key)
                .compact();
    }

    // Backward-compatible overload
    public String createToken(Long userId, String email) {
        return createToken(userId, email, "USER");
    }

    // ✅ Throws if token invalid (useful in services)
    public Long getUserId(String token) {
        return Long.valueOf(getClaims(token).getSubject());
    }

    // ✅ Safe version (useful in filters)
    public Long getUserIdOrNull(String token) {
        try {
            return getUserId(token);
        } catch (Exception e) {
            return null;
        }
    }

    public String getEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    public String getRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // ✅ Helps debugging / tests
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);

        return jws.getBody();
    }
}
