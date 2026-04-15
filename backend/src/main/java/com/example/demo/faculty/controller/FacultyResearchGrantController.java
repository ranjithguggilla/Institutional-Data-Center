package com.example.demo.faculty.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.admin.GovernanceService;
import com.example.demo.faculty.entity.FacultyResearchGrant;
import com.example.demo.faculty.service.FacultyResearchGrantService;
import com.example.demo.faculty.service.FacultyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("faculty-grant")
@RequiredArgsConstructor
public class FacultyResearchGrantController {

    private final FacultyResearchGrantService grantService;
    private final FacultyService facultyService;
    private final GovernanceService governanceService;

    @GetMapping("list")
    public List<FacultyResearchGrant> list(Principal principal) {
        return grantService.listByFaculty(facultyService.getFacultyById(principal.getName()));
    }

    @PostMapping("add")
    public FacultyResearchGrant add(@RequestBody FacultyResearchGrant body, Principal principal) {
        body.setFaculty(facultyService.getFacultyById(principal.getName()));
        body.setGrantId(0);
        FacultyResearchGrant saved = grantService.save(body);
        governanceService.recordChange(principal.getName(), "FACULTY_GRANT", String.valueOf(saved.getGrantId()),
                "CREATE", "Research grant added: " + saved.getTitle());
        return saved;
    }

    @PutMapping("update/{grantId}")
    public FacultyResearchGrant update(@PathVariable int grantId, @RequestBody FacultyResearchGrant patch,
            Principal principal) {
        FacultyResearchGrant existing = grantService.findById(grantId)
                .orElseThrow(() -> new IllegalArgumentException("Grant not found"));
        if (existing.getFaculty() == null
                || !principal.getName().equals(existing.getFaculty().getFacultyId())) {
            throw new IllegalArgumentException("Not allowed");
        }
        if (patch.getTitle() != null) {
            existing.setTitle(patch.getTitle());
        }
        if (patch.getFundingAgency() != null) {
            existing.setFundingAgency(patch.getFundingAgency());
        }
        if (patch.getAmount() != null) {
            existing.setAmount(patch.getAmount());
        }
        if (patch.getStartDate() != null) {
            existing.setStartDate(patch.getStartDate());
        }
        if (patch.getEndDate() != null) {
            existing.setEndDate(patch.getEndDate());
        }
        if (patch.getDescription() != null) {
            existing.setDescription(patch.getDescription());
        }
        if (patch.getProjectUrl() != null) {
            existing.setProjectUrl(patch.getProjectUrl());
        }
        FacultyResearchGrant saved = grantService.save(existing);
        governanceService.recordChange(principal.getName(), "FACULTY_GRANT", String.valueOf(grantId), "UPDATE",
                "Research grant updated");
        return saved;
    }

    @DeleteMapping("delete/{grantId}")
    public void delete(@PathVariable int grantId, Principal principal) {
        FacultyResearchGrant existing = grantService.findById(grantId)
                .orElseThrow(() -> new IllegalArgumentException("Grant not found"));
        if (existing.getFaculty() == null
                || !principal.getName().equals(existing.getFaculty().getFacultyId())) {
            throw new IllegalArgumentException("Not allowed");
        }
        grantService.deleteById(grantId);
        governanceService.recordChange(principal.getName(), "FACULTY_GRANT", String.valueOf(grantId), "DELETE",
                "Research grant removed");
    }
}
