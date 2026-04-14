package com.example.demo.security;

import java.security.Principal;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("get-user-object")
    public User getUser(Principal principal) {
        Optional<User> user = userRepository.findById(principal.getName());
        return user.orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody User dto) {
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        User addUser = userRepository.save(dto);
        return new ResponseEntity<>(addUser, HttpStatus.CREATED);
    }
}
