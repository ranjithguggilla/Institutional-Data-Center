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
    private final GovernanceService governanceService;

    @PostMapping("add-project")
    public boolean addProject(@RequestBody FacultyProject project, Principal principal) {
        Faculty faculty = facultyService.getFacultyById(principal.getName());
        project.setFaculty(faculty);
        boolean created = facultyProjectService.addProject(project);
        if (created) {
            governanceService.recordChange(principal.getName(), "FACULTY_PROJECT", faculty.getFacultyId(), "CREATE",
                    "Faculty project added: " + project.getProjectTitle());
        }
        return created;
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
    public boolean updateProject(@PathVariable("projectId") int projectId, @RequestBody FacultyProject project, Principal principal) {
        boolean updated = facultyProjectService.updateProject(project);
        if (updated) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "FACULTY_PROJECT",
                    String.valueOf(projectId), "UPDATE", "Faculty project updated: " + project.getProjectTitle());
        }
        return updated;
    }

    @DeleteMapping("delete-project/{projectId}")
    public boolean deleteProject(@PathVariable("projectId") int projectId, Principal principal) {
        boolean deleted = facultyProjectService.deleteProject(projectId);
        if (deleted) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "FACULTY_PROJECT",
                    String.valueOf(projectId), "DELETE", "Faculty project removed");
        }
        return deleted;
    }
}
