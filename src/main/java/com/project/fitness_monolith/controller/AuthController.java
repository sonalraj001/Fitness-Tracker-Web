package com.project.fitness_monolith.controller;

import com.project.fitness_monolith.dto.LoginRequest;
import com.project.fitness_monolith.dto.LoginResponse;
import com.project.fitness_monolith.dto.UserResponse;
import com.project.fitness_monolith.dto.registerRequest;
import com.project.fitness_monolith.model.User;
import com.project.fitness_monolith.repository.UserRepository;
import com.project.fitness_monolith.security.JwtUtils;
import com.project.fitness_monolith.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody registerRequest registerRequest){
        return ResponseEntity.ok(userService.register(registerRequest));
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest){
        Authentication authentication = null;

        try{
            User user = userRepository.findByEmail(loginRequest.getEmail());
            if(user==null) return ResponseEntity.status(401).build();

            if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPassword())){
                return ResponseEntity.status(401).build();
            }

            String token = jwtUtils.generateToken(user.getId(),user.getRole().name());

            return ResponseEntity.ok(new LoginResponse(
                    token,userService.mapToResponse(user)
            ));
        }
        catch (AuthenticationException e){
            e.printStackTrace();
            return ResponseEntity.status(401).build();
        }


    }
}
