package com.example.demo.faculty.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.faculty.FacultyEntityChecks;
import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.FacultyProfessionalLicense;
import com.example.demo.faculty.repository.FacultyProfessionalLicenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacultyProfessionalLicenseService {

    private final FacultyProfessionalLicenseRepository repository;

    public List<FacultyProfessionalLicense> listByFaculty(Faculty faculty) {
        if (!FacultyEntityChecks.isPersisted(faculty)) {
            return Collections.emptyList();
        }
        return repository.findByFacultyOrderByExpiryDateDesc(faculty);
    }

    public Optional<FacultyProfessionalLicense> findById(int id) {
        return repository.findById(id);
    }

    public FacultyProfessionalLicense save(FacultyProfessionalLicense entity) {
        return repository.save(entity);
    }

    public void deleteById(int id) {
        repository.deleteById(id);
    }
}
