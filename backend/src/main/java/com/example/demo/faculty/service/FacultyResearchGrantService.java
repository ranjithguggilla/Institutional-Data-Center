package com.example.demo.faculty.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.faculty.FacultyEntityChecks;
import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.FacultyResearchGrant;
import com.example.demo.faculty.repository.FacultyResearchGrantRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacultyResearchGrantService {

    private final FacultyResearchGrantRepository repository;

    public List<FacultyResearchGrant> listByFaculty(Faculty faculty) {
        if (!FacultyEntityChecks.isPersisted(faculty)) {
            return Collections.emptyList();
        }
        return repository.findByFacultyOrderByStartDateDesc(faculty);
    }

    public Optional<FacultyResearchGrant> findById(int id) {
        return repository.findById(id);
    }

    public FacultyResearchGrant save(FacultyResearchGrant entity) {
        return repository.save(entity);
    }

    public void deleteById(int id) {
        repository.deleteById(id);
    }
}
