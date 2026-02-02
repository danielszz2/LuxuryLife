package com.luxurylife.backend.security;

import com.luxurylife.backend.model.User;
import com.luxurylife.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        System.out.println("[JwtAuthFilter] " + request.getMethod() + " " + request.getRequestURI());

        // If already authenticated, skip
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String auth = request.getHeader("Authorization");
        System.out.println("[JwtAuthFilter] Authorization header: " + auth);

        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7).trim();
            System.out.println("[JwtAuthFilter] Bearer token found");

            try {
                Long userId = jwtService.getUserId(token);
                System.out.println("[JwtAuthFilter] Parsed userId from token: " + userId);

                User user = userRepository.findById(userId).orElse(null);

                if (user != null) {
                    System.out.println("[JwtAuthFilter] User found: " + user.getEmail());

                    // ✅ Step J: get role from DB
                    String role = user.getRole();
                    if (role == null || role.isBlank()) role = "USER";

                    var authentication = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    System.out.println("[JwtAuthFilter] Granted role: ROLE_" + role);
                } else {
                    System.out.println("[JwtAuthFilter] User not found in DB for userId: " + userId);
                }
            } catch (Exception e) {
                System.out.println("[JwtAuthFilter] Token invalid: " + e.getMessage());
            }
        } else {
            System.out.println("[JwtAuthFilter] No Bearer token in Authorization header");
        }

        filterChain.doFilter(request, response);
    }
}

