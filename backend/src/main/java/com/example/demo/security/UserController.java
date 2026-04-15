package com.example.demo.security;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.student.entity.Student;
import com.example.demo.student.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentService studentService;

    @GetMapping("get-user-object")
    public User getUser(Principal principal) {
        Optional<User> user = userRepository.findById(principal.getName());
        return user.orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody User dto) {
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        User addUser = userRepository.save(dto);
        if (addUser.getRole() != null && "STUDENT".equalsIgnoreCase(addUser.getRole().trim())) {
            ensureStudentRowForNewAccount(addUser.getUserName());
        }
        return new ResponseEntity<>(addUser, HttpStatus.CREATED);
    }

    /**
     * Self-registration only creates a {@link User}. The student dashboard loads skills/projects/etc.
     * using a persisted {@link Student} row; without it, JPA queries by transient Student can fail and
     * the SPA logs the user out. Create a minimal profile keyed by the same id as the login name.
     */
    private void ensureStudentRowForNewAccount(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            return;
        }
        String id = studentId.trim();
        if (studentService.studentExist(id)) {
            return;
        }
        Student stub = new Student();
        stub.setStudentId(id);
        stub.setStudentName("");
        stub.setStudentGender(false);
        studentService.addStudent(stub);
    }

    @GetMapping("all")
    public List<UserSummaryDto> getAllUsers(Principal principal) {
        requireAdmin(principal);
        return userRepository.findAllByOrderByUserNameAsc().stream()
                .map(user -> new UserSummaryDto(user.getUserName(), user.getRole()))
                .toList();
    }

    @PutMapping("role/{userName}")
    public UserSummaryDto updateRole(
            Principal principal,
            @PathVariable("userName") String userName,
            @RequestBody UpdateUserRoleDto dto) {
        requireAdmin(principal);
        String newRole = dto.getRole() != null ? dto.getRole().trim().toUpperCase() : "";
        if (!"ADMIN".equals(newRole) && !"STUDENT".equals(newRole) && !"FACULTY".equals(newRole)) {
            throw new IllegalArgumentException("Role must be ADMIN, STUDENT, or FACULTY.");
        }

        User user = userRepository.findById(userName)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userName));
        user.setRole(newRole);
        User saved = userRepository.save(user);
        return new UserSummaryDto(saved.getUserName(), saved.getRole());
    }

    @DeleteMapping("{userName}")
    public ResponseEntity<Void> deleteUser(Principal principal, @PathVariable("userName") String userName) {
        requireAdmin(principal);
        if (principal.getName().equals(userName)) {
            throw new IllegalArgumentException("You cannot delete the currently logged-in admin.");
        }
        if (!userRepository.existsById(userName)) {
            throw new IllegalArgumentException("User not found: " + userName);
        }
        userRepository.deleteById(userName);
        return ResponseEntity.noContent().build();
    }

    private void requireAdmin(Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authentication required.");
        }
        User user = userRepository.findById(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "User not found."));
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin role required.");
        }
    }
}
