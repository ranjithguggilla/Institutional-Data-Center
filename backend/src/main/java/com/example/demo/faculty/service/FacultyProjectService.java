package com.example.demo.faculty.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.FacultyProject;
import com.example.demo.faculty.repository.FacultyProjectRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.example.demo.faculty.FacultyEntityChecks;

@Service
@RequiredArgsConstructor
public class FacultyProjectService {

    private final FacultyProjectRepository facultyProjectRepository;

    public boolean projectExists(int projectId) {
        Optional<FacultyProject> project = facultyProjectRepository.findById(projectId);
        return project.isPresent();
    }

    public boolean addProject(FacultyProject project) {
        if (!projectExists(project.getProjectId())) {
            facultyProjectRepository.save(project);
            return true;
        }
        return false;
    }

    public List<FacultyProject> getAllProjects() {
        return facultyProjectRepository.findAll();
    }

    public boolean deleteProject(int projectId) {
        if (projectExists(projectId)) {
            facultyProjectRepository.deleteById(projectId);
            return true;
        }
        return false;
    }

    public FacultyProject getProjectById(int projectId) {
        Optional<FacultyProject> project = facultyProjectRepository.findById(projectId);
        if (project.isPresent()) {
        	return project.get();
        }
        return new FacultyProject();
    }

    public boolean updateProject(FacultyProject project) {
        if (projectExists(project.getProjectId())) {
            facultyProjectRepository.save(project);
            return true;
        }
        return false;
    }
    
    public List<FacultyProject> getProjectByFaculty(Faculty faculty){
        if (!FacultyEntityChecks.isPersisted(faculty)) {
            return Collections.emptyList();
        }
    	return facultyProjectRepository.findByFaculty(faculty);
    }
}