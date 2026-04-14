package com.example.demo.student.controller;

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

import com.example.demo.student.entity.Project;
import com.example.demo.student.entity.Student;
import com.example.demo.student.service.ProjectService;
import com.example.demo.student.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final StudentService studentService;

    @PostMapping("add-project")
    public boolean addProject(@RequestBody Project project, Principal principal) {
        Student student = studentService.getStudentById(principal.getName());
        project.setStudent(student);
        return projectService.addProject(project);
    }

    @GetMapping("get-project/{projectId}")
    public Project getProjectById(@PathVariable("projectId") int projectId) {
        return projectService.getProjectById(projectId);
    }

    @GetMapping("get-all-projects")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("get-all-projects-by-id")
    public List<Project> getProjectsById(Principal principal) {
        return projectService.getProjectByStudent(studentService.getStudentById(principal.getName()));
    }

    @GetMapping("get-all-projects-by-id/{studentId}")
    public List<Project> getProjectsById(@PathVariable("studentId") String studentId) {
        return projectService.getProjectByStudent(studentService.getStudentById(studentId));
    }

    @PutMapping("update-project/{projectId}")
    public boolean updateProject(@PathVariable("projectId") int projectId, @RequestBody Project project) {
        return projectService.updateProject(project);
    }

    @DeleteMapping("delete-project/{projectId}")
    public boolean deleteProject(@PathVariable("projectId") int projectId) {
        return projectService.deleteProject(projectId);
    }
}
