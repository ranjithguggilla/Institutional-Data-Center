package com.example.demo.excel;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.service.ExperienceService;
import com.example.demo.faculty.service.FacultyCertificationService;
import com.example.demo.faculty.service.FacultyProjectService;
import com.example.demo.faculty.service.FacultyService;
import com.example.demo.faculty.service.ResearchPapersService;
import com.example.demo.student.entity.Student;
import com.example.demo.student.repository.StudentRepository;
import com.example.demo.student.service.CertificationService;
import com.example.demo.student.service.InternshipService;
import com.example.demo.student.service.ProjectService;
import com.example.demo.student.service.SkillService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExcelService {

    private final StudentRepository studentRepository;
    private final CertificationService certificationService;
    private final InternshipService internshipService;
    private final SkillService skillService;
    private final ProjectService projectService;
    private final FacultyService facultyService;
    private final FacultyCertificationService facultyCertificationService;
    private final ResearchPapersService researchPapersService;
    private final ExperienceService experienceService;
    private final FacultyProjectService facultyProjectService;

    public ByteArrayInputStream getActualData() {
        List<Student> allStudents = studentRepository.findAll();
        Helper helper = new Helper(certificationService, internshipService, skillService, projectService);
        return helper.dataToExcel(allStudents);
    }

    public ByteArrayInputStream getFacultyData() {
        List<Faculty> allFaculties = facultyService.getAllFaculties();
        FacultyHelper facultyHelper = new FacultyHelper(facultyCertificationService, researchPapersService,
                experienceService, facultyProjectService);
        return facultyHelper.dataToExcel(allFaculties);
    }
}
