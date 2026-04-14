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

import com.example.demo.faculty.entity.Experience;
import com.example.demo.faculty.service.ExperienceService;
import com.example.demo.faculty.service.FacultyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("experience")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;
    private final FacultyService facultyService;

    @PostMapping("add-experience")
    public boolean addExperience(Principal principal, @RequestBody Experience experience) {
        experience.setFaculty(facultyService.getFacultyById(principal.getName()));
        return experienceService.addExperience(experience);
    }

    @GetMapping("get-experience/{experienceId}")
    public Experience getExperienceById(@PathVariable("experienceId") int experienceId) {
        return experienceService.getExperienceById(experienceId);
    }

    @GetMapping("get-all-experiences")
    public List<Experience> getAllExperiences() {
        return experienceService.getAllExperiences();
    }

    @GetMapping("get-all-experiences-by-id")
    public List<Experience> getAllExperiencesById(Principal principal) {
        return experienceService.getByFacultyObject(facultyService.getFacultyById(principal.getName()));
    }

    @GetMapping("get-all-experiences-by-id/{facultyId}")
    public List<Experience> getAllExperiencesById(@PathVariable("facultyId") String facultyId) {
        return experienceService.getByFacultyObject(facultyService.getFacultyById(facultyId));
    }

    @PutMapping("update-experience/{experienceId}")
    public boolean updateExperience(@PathVariable("experienceId") int experienceId, @RequestBody Experience experience) {
        return experienceService.updateExperience(experience);
    }

    @DeleteMapping("delete-experience/{experienceId}")
    public boolean deleteExperience(@PathVariable("experienceId") int experienceId) {
        return experienceService.deleteExperience(experienceId);
    }

    @GetMapping("get-unique-experiences-by-faculty-id/{facultyId}")
    public List<String> getExperiencesById(@PathVariable("facultyId") String facultyId) {
        return experienceService.getUniqueExperienceCompanyByFaculty(facultyService.getFacultyById(facultyId));
    }

    @GetMapping("get-all-unique-faculty-ids-by-experience")
    public List<String> getAllUniqueStudentIdsByExperience() {
        return experienceService.getAllUniqueExperienceFacultyIds();
    }

    @GetMapping("get-unique-experiences")
    public List<String> getAllUniqueExperiences() {
        return experienceService.getAllUniqueExperiences();
    }
}
