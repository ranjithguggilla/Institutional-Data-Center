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
import com.example.demo.faculty.entity.FacultyProfessionalLicense;
import com.example.demo.faculty.service.FacultyProfessionalLicenseService;
import com.example.demo.faculty.service.FacultyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("faculty-license")
@RequiredArgsConstructor
public class FacultyProfessionalLicenseController {

    private final FacultyProfessionalLicenseService licenseService;
    private final FacultyService facultyService;
    private final GovernanceService governanceService;

    @GetMapping("list")
    public List<FacultyProfessionalLicense> list(Principal principal) {
        return licenseService.listByFaculty(facultyService.getFacultyById(principal.getName()));
    }

    @PostMapping("add")
    public FacultyProfessionalLicense add(@RequestBody FacultyProfessionalLicense body, Principal principal) {
        body.setFaculty(facultyService.getFacultyById(principal.getName()));
        body.setLicenseId(0);
        FacultyProfessionalLicense saved = licenseService.save(body);
        governanceService.recordChange(principal.getName(), "FACULTY_LICENSE", String.valueOf(saved.getLicenseId()),
                "CREATE", "Professional license added: " + saved.getTitle());
        return saved;
    }

    @PutMapping("update/{licenseId}")
    public FacultyProfessionalLicense update(@PathVariable int licenseId, @RequestBody FacultyProfessionalLicense patch,
            Principal principal) {
        FacultyProfessionalLicense existing = licenseService.findById(licenseId)
                .orElseThrow(() -> new IllegalArgumentException("License not found"));
        if (existing.getFaculty() == null
                || !principal.getName().equals(existing.getFaculty().getFacultyId())) {
            throw new IllegalArgumentException("Not allowed");
        }
        if (patch.getTitle() != null) {
            existing.setTitle(patch.getTitle());
        }
        if (patch.getIssuingBody() != null) {
            existing.setIssuingBody(patch.getIssuingBody());
        }
        if (patch.getLicenseNumber() != null) {
            existing.setLicenseNumber(patch.getLicenseNumber());
        }
        if (patch.getExpiryDate() != null) {
            existing.setExpiryDate(patch.getExpiryDate());
        }
        if (patch.getVerificationUrl() != null) {
            existing.setVerificationUrl(patch.getVerificationUrl());
        }
        if (patch.getNotes() != null) {
            existing.setNotes(patch.getNotes());
        }
        FacultyProfessionalLicense saved = licenseService.save(existing);
        governanceService.recordChange(principal.getName(), "FACULTY_LICENSE", String.valueOf(licenseId), "UPDATE",
                "Professional license updated");
        return saved;
    }

    @DeleteMapping("delete/{licenseId}")
    public void delete(@PathVariable int licenseId, Principal principal) {
        FacultyProfessionalLicense existing = licenseService.findById(licenseId)
                .orElseThrow(() -> new IllegalArgumentException("License not found"));
        if (existing.getFaculty() == null
                || !principal.getName().equals(existing.getFaculty().getFacultyId())) {
            throw new IllegalArgumentException("Not allowed");
        }
        licenseService.deleteById(licenseId);
        governanceService.recordChange(principal.getName(), "FACULTY_LICENSE", String.valueOf(licenseId), "DELETE",
                "Professional license removed");
    }
}
