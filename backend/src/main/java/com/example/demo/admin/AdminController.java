package com.example.demo.admin;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.faculty.repository.FacultyRepository;
import com.example.demo.security.User;
import com.example.demo.security.UserRepository;
import com.example.demo.student.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("admin")
@RequiredArgsConstructor
public class AdminController {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final ApprovalRequestRepository approvalRequestRepository;
    private final ActionAuditRepository actionAuditRepository;

    @GetMapping("analytics/overview")
    public Map<String, Object> getOverview(Principal principal) {
        requireAdmin(principal);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("studentCount", studentRepository.count());
        response.put("facultyCount", facultyRepository.count());
        response.put("userCount", userRepository.count());
        response.put("pendingApprovals", approvalRequestRepository.countByStatus(STATUS_PENDING));
        response.put("approvedApprovals", approvalRequestRepository.countByStatus(STATUS_APPROVED));
        response.put("rejectedApprovals", approvalRequestRepository.countByStatus(STATUS_REJECTED));
        response.put("studentsByDepartment", toCountMap(studentRepository.countStudentsByDepartment()));
        response.put("facultyByDepartment", toCountMap(facultyRepository.countFacultyByDepartment()));
        response.put("usersByRole", toCountMap(userRepository.countUsersByRole()));
        return response;
    }

    @GetMapping("approvals")
    public List<ApprovalRequest> getApprovals(Principal principal,
            @RequestParam(value = "status", required = false) String status) {
        requireAdmin(principal);
        if (status == null || status.isBlank()) {
            return approvalRequestRepository.findAllByOrderByCreatedAtDesc();
        }
        return approvalRequestRepository.findByStatusOrderByCreatedAtDesc(status.trim().toUpperCase());
    }

    @GetMapping("audit-trail")
    public List<ActionAudit> getAuditTrail(
            Principal principal,
            @RequestParam(value = "entityType", required = false) String entityType) {
        requireAdmin(principal);
        if (entityType == null || entityType.isBlank()) {
            return actionAuditRepository.findAllByOrderByCreatedAtDesc();
        }
        return actionAuditRepository.findByEntityTypeOrderByCreatedAtDesc(entityType.trim().toUpperCase());
    }

    @PostMapping("approvals/request")
    public ResponseEntity<ApprovalRequest> createApprovalRequest(
            Principal principal,
            @RequestBody CreateApprovalRequestDto dto) {
        String requestedBy = principal != null ? principal.getName() : "system";
        String entityType = normalizeEntityType(dto.getEntityType());
        String entityId = dto.getEntityId() != null ? dto.getEntityId().trim() : "";
        if (entityId.isEmpty()) {
            throw new IllegalArgumentException("Entity ID is required.");
        }

        ApprovalRequest request = new ApprovalRequest();
        request.setEntityType(entityType);
        request.setEntityId(entityId);
        request.setStatus(STATUS_PENDING);
        request.setNote(dto.getNote());
        request.setRequestedBy(requestedBy);
        request.setCreatedAt(LocalDateTime.now());
        ApprovalRequest saved = approvalRequestRepository.save(request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("approvals/{id}/review")
    public ApprovalRequest reviewApproval(
            Principal principal,
            @PathVariable("id") Long id,
            @RequestBody ReviewApprovalRequestDto dto) {
        requireAdmin(principal);
        ApprovalRequest request = approvalRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Approval request not found: " + id));

        String status = dto.getStatus() != null ? dto.getStatus().trim().toUpperCase() : "";
        if (!STATUS_APPROVED.equals(status) && !STATUS_REJECTED.equals(status) && !STATUS_PENDING.equals(status)) {
            throw new IllegalArgumentException("Status must be PENDING, APPROVED, or REJECTED.");
        }

        request.setStatus(status);
        request.setNote(dto.getNote());
        request.setReviewedBy(principal.getName());
        request.setReviewedAt(LocalDateTime.now());
        return approvalRequestRepository.save(request);
    }

    private String normalizeEntityType(String entityType) {
        String normalized = entityType != null ? entityType.trim().toUpperCase() : "";
        if (!"STUDENT".equals(normalized) && !"FACULTY".equals(normalized) && !"USER".equals(normalized)) {
            throw new IllegalArgumentException("Entity type must be STUDENT, FACULTY, or USER.");
        }
        return normalized;
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

    private Map<String, Long> toCountMap(List<Object[]> rows) {
        Map<String, Long> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String key = String.valueOf(row[0]);
            Long value = ((Number) row[1]).longValue();
            result.put(key, value);
        }
        return result;
    }
}
