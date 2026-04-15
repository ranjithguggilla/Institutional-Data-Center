package com.example.demo.admin;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ActionAuditRepository extends JpaRepository<ActionAudit, Long> {

    List<ActionAudit> findAllByOrderByCreatedAtDesc();

    List<ActionAudit> findByEntityTypeOrderByCreatedAtDesc(String entityType);
}
