package com.example.demo.faculty.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.sql.Date;
import java.util.List;
import java.util.UUID;

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

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.FacultyCertification;
import com.example.demo.faculty.service.FacultyCertificationService;
import com.example.demo.faculty.service.FacultyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("faculty-certification")
@RequiredArgsConstructor
public class FacultyCertificationController {

    private final FacultyCertificationService certificationService;
    private final FacultyService facultyService;

    @PostMapping("add-certification")
    public ResponseEntity<String> addCertification(@RequestParam("file") MultipartFile file,
                                                   Principal principal,
                                                   @RequestParam("certificationName") String certificationName,
                                                   @RequestParam("expiryDate") Date expiryDate,
                                                   @RequestParam("type") String type,
                                                   @RequestParam("verification") String verification) {
        try {
            String directory = "src/main/resources/static/faculty_certifications/";
            String fileName = certificationName + "_" + UUID.randomUUID().toString() + ".jpg";
            Faculty faculty = facultyService.getFacultyById(principal.getName());
            Path uploadPath = Paths.get(directory).resolve(fileName);
            Files.createDirectories(uploadPath.getParent());
            Files.copy(file.getInputStream(), uploadPath);

            FacultyCertification certification = new FacultyCertification();
            certification.setCertificationName(certificationName);
            certification.setExpiryDate(expiryDate);
            certification.setVerification(verification);
            certification.setType(type);
            certification.setCertify("/faculty_certifications/" + fileName);
            certification.setFaculty(faculty);
            certificationService.addCertification(certification);

            return ResponseEntity.ok("Certification details uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload certification details.");
        }
    }

    @GetMapping("get-certification/{certificationId}")
    public FacultyCertification getCertificationById(@PathVariable("certificationId") int certificationId) {
        return certificationService.getCertificationById(certificationId);
    }

    @GetMapping("get-all-certifications")
    public List<FacultyCertification> getAllCertifications() {
        return certificationService.getAllCertifications();
    }

    @GetMapping("get-all-certifications-by-id")
    public List<FacultyCertification> getCertificationsById(Principal principal) {
        return certificationService.getCertificationByFaculty(facultyService.getFacultyById(principal.getName()));
    }

    @GetMapping("get-all-certifications-by-id/{facultyId}")
    public List<FacultyCertification> getCertificationsByFacultyId(@PathVariable("facultyId") String facultyId) {
        return certificationService.getCertificationByFaculty(facultyService.getFacultyById(facultyId));
    }

    @PutMapping("update-certification/{certificationId}")
    public boolean updateCertification(@PathVariable("certificationId") int certificationId, @RequestBody FacultyCertification certification) {
        return certificationService.updateCertification(certification);
    }

    @DeleteMapping("delete-certification/{certificationId}")
    public boolean deleteCertification(@PathVariable("certificationId") int certificationId) {
        return certificationService.deleteCertification(certificationId);
    }

    @GetMapping("get-unique-certifications-by-faculty-id/{facultyId}")
    public List<String> getCertificationsById(@PathVariable("facultyId") String facultyId) {
        return certificationService.getUniqueCertificationTypeByFaculty(facultyService.getFacultyById(facultyId));
    }

    @GetMapping("get-all-unique-faculty-ids-by-certification")
    public List<String> getAllUniqueStudentIdsByCertifications() {
        return certificationService.getAllUniqueCertificationFacultyIds();
    }
}
