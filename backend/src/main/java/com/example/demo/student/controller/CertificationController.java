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

import com.example.demo.admin.GovernanceService;
import com.example.demo.student.entity.Certification;
import com.example.demo.student.entity.Student;
import com.example.demo.student.service.CertificationService;
import com.example.demo.student.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("certification")
@RequiredArgsConstructor
public class CertificationController {

    private static final Logger log = LoggerFactory.getLogger(CertificationController.class);

    private final CertificationService certificationService;
    private final StudentService studentService;
    private final GovernanceService governanceService;

    @PostMapping("add-certification")
    public ResponseEntity<String> addCertification(@RequestParam("file") MultipartFile file,
                                                   Principal principal,
                                                   @RequestParam("certificationName") String certificationName,
                                                   @RequestParam("expiryDate") Date expiryDate,
                                                   @RequestParam("type") String type,
                                                   @RequestParam("verification") String verification) {
        try {
            String directory = "src/main/resources/static/certifications/";
            String fileName = certificationName + "_" + UUID.randomUUID().toString() + ".jpg";
            Student student = studentService.getStudentById(principal.getName());
            Path uploadPath = Paths.get(directory).resolve(fileName);
            Files.createDirectories(uploadPath.getParent());
            Files.copy(file.getInputStream(), uploadPath);

            Certification certification = new Certification();
            certification.setCertificationName(certificationName);
            certification.setExpiryDate(expiryDate);
            certification.setVerification(verification);
            certification.setType(type);
            certification.setCertify("/certifications/" + fileName);
            certification.setStudent(student);
            certificationService.addCertification(certification);
            governanceService.recordChange(principal.getName(), "CERTIFICATION", student.getStudentId(), "CREATE",
                    "Certification added: " + certificationName);

            return ResponseEntity.ok("Certification details uploaded successfully.");
        } catch (IOException e) {
            log.error("Failed to upload certification for {}", principal.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload certification details.");
        }
    }

    @GetMapping("get-certification/{certificationId}")
    public Certification getCertificationById(@PathVariable("certificationId") int certificationId) {
        return certificationService.getCertificationById(certificationId);
    }

    @GetMapping("get-all-certifications")
    public List<Certification> getAllCertifications() {
        return certificationService.getAllCertifications();
    }

    @GetMapping("get-all-certifications-by-id")
    public List<Certification> getCertificationsById(Principal principal) {
        return certificationService.getCertificationByStudent(studentService.getStudentById(principal.getName()));
    }

    @GetMapping("get-all-certifications-by-id/{studentId}")
    public List<Certification> getCertificationsById(@PathVariable("studentId") String studentId) {
        return certificationService.getCertificationByStudent(studentService.getStudentById(studentId));
    }

    @PutMapping("update-certification/{certificationId}")
    public boolean updateCertification(
            @PathVariable("certificationId") int certificationId,
            @RequestBody Certification certification,
            Principal principal) {
        boolean updated = certificationService.updateCertification(certification);
        if (updated) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "CERTIFICATION",
                    String.valueOf(certificationId), "UPDATE",
                    "Certification updated: " + certification.getCertificationName());
        }
        return updated;
    }

    @DeleteMapping("delete-certification/{certificationId}")
    public boolean deleteCertification(@PathVariable("certificationId") int certificationId, Principal principal) {
        boolean deleted = certificationService.deleteCertification(certificationId);
        if (deleted) {
            governanceService.recordChange(principal != null ? principal.getName() : "system", "CERTIFICATION",
                    String.valueOf(certificationId), "DELETE", "Certification removed");
        }
        return deleted;
    }

    @GetMapping("get-all-unique-student-ids-by-certification")
    public List<String> getAllUniqueStudentIdsByCertification() {
        return certificationService.getAllUniqueCertificationStudentIds();
    }

    @GetMapping("get-unique-certifications-technical")
    public List<String> getAllUniqueCertificationsTechnical() {
        return certificationService.getAllUniqueCertificationsTechnical();
    }

    @GetMapping("get-unique-certifications-non-technical")
    public List<String> getAllUniqueCertificationsNonTechnical() {
        return certificationService.getAllUniqueCertificationsNonTechnical();
    }

    @GetMapping("get-unique-certifications-by-student-id/{studentId}")
    public List<String> getAllUniqueCertificationsByStudentId(@PathVariable("studentId") String studentId) {
        return certificationService.getAllUniqueCertificationByStudentId(studentService.getStudentById(studentId));
    }
}
