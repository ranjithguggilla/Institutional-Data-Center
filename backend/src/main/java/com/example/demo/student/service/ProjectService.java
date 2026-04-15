package com.example.demo.student.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.example.demo.student.entity.Project;
import com.example.demo.student.entity.Student;
import com.example.demo.student.repository.ProjectRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public boolean projectExists(int projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.isPresent();
    }

    public boolean addProject(Project project) {
        if (!projectExists(project.getProjectId())) {
            projectRepository.save(project);
            return true;
        }
        return false;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public boolean deleteProject(int projectId) {
        if (projectExists(projectId)) {
            projectRepository.deleteById(projectId);
            return true;
        }
        return false;
    }

    public Project getProjectById(int projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
        	return project.get();
        }
        return new Project();
    }

    public boolean updateProject(Project project) {
        if (projectExists(project.getProjectId())) {
            projectRepository.save(project);
            return true;
        }
        return false;
    }
    
    public List<Project> getProjectByStudent(Student student) {
        if (student == null || !StringUtils.hasText(student.getStudentId())) {
            return Collections.emptyList();
        }
        return projectRepository.findByStudent(student);
    }
}