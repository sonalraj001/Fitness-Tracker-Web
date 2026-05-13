package com.project.fitness_monolith.service;

import com.project.fitness_monolith.dto.UserResponse;
import com.project.fitness_monolith.dto.registerRequest;
import com.project.fitness_monolith.model.User;
import com.project.fitness_monolith.model.UserRole;
import com.project.fitness_monolith.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor

public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(registerRequest request) {
        UserRole role = request.getRole()!=null ? request.getRole()
                : UserRole.USER;
        User user = User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstname())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
//        User user =  new User(
//                null,
//                request.getEmail(),
//                request.getPassword(),
//                request.getFirstname(),
//                request.getLastName(),
//                Instant.parse("2011-12-03T10:15:30Z")
//                        .atZone(ZoneOffset.UTC)
//                        .toLocalDateTime(),
//                Instant.parse("2011-12-03T10:15:30Z")
//                        .atZone(ZoneOffset.UTC)
//                        .toLocalDateTime(),
//                null,
//
//                null
//        );
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);

    }

    public UserResponse mapToResponse(User savedUser) {
        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setEmail(savedUser.getEmail());
        response.setPassword(savedUser.getPassword());
        response.setFirstname(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setCreatedAt(savedUser.getCreatedAt());
        response.setUpdatedAt(savedUser.getCreatedAt());
        return  response;
    }
}
