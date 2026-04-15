package com.example.demo.admin;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GovernanceService {

    private static final String STATUS_PENDING = "PENDING";

    private final ApprovalRequestRepository approvalRequestRepository;
    private final ActionAuditRepository actionAuditRepository;

    public void recordChange(
            String requestedBy,
            String entityType,
            String entityId,
            String actionType,
            String details) {
        String actor = requestedBy == null || requestedBy.isBlank() ? "system" : requestedBy.trim();
        String normalizedEntityType = normalize(entityType);
        String normalizedAction = normalize(actionType);
        String normalizedEntityId = entityId == null ? "" : entityId.trim();
        LocalDateTime now = LocalDateTime.now();

        ActionAudit audit = new ActionAudit();
        audit.setEntityType(normalizedEntityType);
        audit.setEntityId(normalizedEntityId);
        audit.setActionType(normalizedAction);
        audit.setPerformedBy(actor);
        audit.setDetails(details);
        audit.setCreatedAt(now);
        actionAuditRepository.save(audit);

        ApprovalRequest approval = new ApprovalRequest();
        approval.setEntityType(normalizedEntityType);
        approval.setEntityId(normalizedEntityId);
        approval.setStatus(STATUS_PENDING);
        approval.setRequestedBy(actor);
        approval.setNote(buildApprovalNote(normalizedAction, details));
        approval.setCreatedAt(now);
        approvalRequestRepository.save(approval);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase();
    }

    private String buildApprovalNote(String actionType, String details) {
        if (details == null || details.isBlank()) {
            return actionType + " submitted for review";
        }
        return actionType + " submitted for review: " + details.trim();
    }
}
