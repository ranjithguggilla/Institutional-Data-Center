package com.example.demo.admin;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, Long> {

    List<ApprovalRequest> findAllByOrderByCreatedAtDesc();

    List<ApprovalRequest> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);
}
