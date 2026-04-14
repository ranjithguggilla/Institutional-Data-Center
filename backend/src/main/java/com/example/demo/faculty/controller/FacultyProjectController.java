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

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.FacultyProject;
import com.example.demo.faculty.service.FacultyProjectService;
import com.example.demo.faculty.service.FacultyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("faculty-project")
@RequiredArgsConstructor
public class FacultyProjectController {

    private final FacultyProjectService facultyProjectService;
    private final FacultyService facultyService;

    @PostMapping("add-project")
    public boolean addProject(@RequestBody FacultyProject project, Principal principal) {
        Faculty faculty = facultyService.getFacultyById(principal.getName());
        project.setFaculty(faculty);
        return facultyProjectService.addProject(project);
    }

    @GetMapping("get-project/{projectId}")
    public FacultyProject getProjectById(@PathVariable("projectId") int projectId) {
        return facultyProjectService.getProjectById(projectId);
    }

    @GetMapping("get-all-projects")
    public List<FacultyProject> getAllProjects() {
        return facultyProjectService.getAllProjects();
    }

    @GetMapping("get-all-projects-by-id")
    public List<FacultyProject> getProjectsById(Principal principal) {
        return facultyProjectService.getProjectByFaculty(facultyService.getFacultyById(principal.getName()));
    }

    @GetMapping("get-all-projects-by-id/{facultyId}")
    public List<FacultyProject> getProjectsById(@PathVariable("facultyId") String facultyId) {
        return facultyProjectService.getProjectByFaculty(facultyService.getFacultyById(facultyId));
    }

    @PutMapping("update-project/{projectId}")
    public boolean updateProject(@PathVariable("projectId") int projectId, @RequestBody FacultyProject project) {
        return facultyProjectService.updateProject(project);
    }

    @DeleteMapping("delete-project/{projectId}")
    public boolean deleteProject(@PathVariable("projectId") int projectId) {
        return facultyProjectService.deleteProject(projectId);
    }
}
