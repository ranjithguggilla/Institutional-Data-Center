package com.example.demo.student.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.sql.Date;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.student.entity.Internship;
import com.example.demo.student.entity.Student;
import com.example.demo.student.service.InternshipService;
import com.example.demo.student.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("internship")
@RequiredArgsConstructor
public class InternshipController {

    private static final Logger log = LoggerFactory.getLogger(InternshipController.class);

    private final InternshipService internshipService;
    private final StudentService studentService;

    @PostMapping("add-internship")
    public ResponseEntity<String> addInternship(@RequestParam("file") MultipartFile file, Principal principal,
            @RequestParam("internshipName") String internshipName, @RequestParam("companyName") String companyName,
            @RequestParam("domain") String domain, @RequestParam("startDate") Date startDate,
            @RequestParam("endDate") Date endDate, @RequestParam("internshipType") String internshipType) {
        try {
            String directory = "src/main/resources/static/internship/";
            String fileName = internshipName + "_" + UUID.randomUUID().toString() + ".JPG";
            Student student = studentService.getStudentById(principal.getName());
            Path uploadPath = Paths.get(directory).resolve(fileName);
            Files.createDirectories(uploadPath.getParent());
            Files.copy(file.getInputStream(), uploadPath);

            Internship internship = new Internship();
            internship.setInternshipName(internshipName);
            internship.setCompanyName(companyName);
            internship.setDomain(domain);
            internship.setStartDate(startDate);
            internship.setEndDate(endDate);
            internship.setInternshipType(internshipType);
            internship.setVerification("/internship/" + fileName);
            internship.setStudent(student);
            internshipService.addInternship(internship);
            return ResponseEntity.ok("Internship details uploaded successfully.");
        } catch (IOException e) {
            log.error("Failed to upload internship for {}", principal.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload internship details.");
        }
    }

    @GetMapping("get-internship/{internshipId}")
    public Internship getInternshipById(@PathVariable("internshipId") int internshipId) {
        return internshipService.getInternshipById(internshipId);
    }

    @GetMapping("get-all-internships")
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }

    @GetMapping("get-all-internships-by-id")
    public List<Internship> getInternshipsById(Principal principal) {
        return internshipService.getInternshipByStudent(studentService.getStudentById(principal.getName()));
    }

    @GetMapping("get-all-internships-by-id/{studentId}")
    public List<Internship> getNormalInternshipsById(@PathVariable("studentId") String studentId) {
        return internshipService.getInternshipByStudent(studentService.getStudentById(studentId));
    }

    @GetMapping("get-all-internships-by-student-id/{studentId}")
    public List<Internship> getInternshipsById(@PathVariable("studentId") String studentId) {
        return internshipService.getInternshipByStudent(studentService.getStudentById(studentId));
    }

    @PutMapping("update-internship/{internshipId}")
    public boolean updateInternship(@PathVariable("internshipId") int internshipId, @RequestBody Internship internship) {
        return internshipService.updateInternship(internship);
    }

    @DeleteMapping("delete-internship/{internshipId}")
    public boolean deleteInternship(@PathVariable("internshipId") int internshipId) {
        return internshipService.deleteInternship(internshipId);
    }

    @GetMapping("get-all-unique-student-ids-by-internship")
    public List<String> getAllUniqueStudentIdsByIntership() {
        return internshipService.getAllUniqueStudentIdsByInternship();
    }

    @GetMapping("get-unique-internships-by-student-id/{studentId}")
    public List<String> getUniqueInternshipByStudentId(@PathVariable("studentId") String studentId) {
        return internshipService.getUniqueInternshipsByStudent(studentService.getStudentById(studentId));
    }
}
