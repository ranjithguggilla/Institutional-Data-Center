package com.example.demo.faculty.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.PersonalDocuments;
import com.example.demo.faculty.service.FacultyService;
import com.example.demo.faculty.service.PersonalDocumentsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("personal-documents")
@RequiredArgsConstructor
public class PersonalDocumentsController {

    private final PersonalDocumentsService personalDocumentsService;
    private final FacultyService facultyService;

    @PostMapping("add-documents")
    public ResponseEntity<String> addDocuments(Principal principal,
            @RequestPart("aadharCard") MultipartFile aadharCard,
            @RequestPart("panCard") MultipartFile panCard) {
        try {
            Faculty faculty = facultyService.getFacultyById(principal.getName());
            String directory = "src/main/resources/static/faculty_aadhar/";
            String fileName = faculty.getFacultyName() + "AADHAR_" + UUID.randomUUID().toString() + ".jpg";
            Path uploadPath = Paths.get(directory).resolve(fileName);
            Files.createDirectories(uploadPath.getParent());
            Files.copy(aadharCard.getInputStream(), uploadPath);

            directory = "src/main/resources/static/faculty_pan/";
            String fileName2 = faculty.getFacultyName() + "PAN_" + UUID.randomUUID().toString() + ".jpg";
            uploadPath = Paths.get(directory).resolve(fileName2);
            Files.createDirectories(uploadPath.getParent());
            Files.copy(panCard.getInputStream(), uploadPath);

            PersonalDocuments personalDocuments = new PersonalDocuments();
            personalDocuments.setFaculty(faculty);
            personalDocuments.setAadharCard("/faculty_aadhar/" + fileName);
            personalDocuments.setPanCard("/faculty_pan/" + fileName2);
            personalDocumentsService.addDocuments(personalDocuments);

            return ResponseEntity.ok("Documents uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload documents.");
        }
    }

    @GetMapping("get-documents")
    public PersonalDocuments getDocuments(Principal principal) {
        Faculty faculty = facultyService.getFacultyById(principal.getName());
        return personalDocumentsService.getDocumentsByFaculty(faculty);
    }

    @GetMapping("get-documents/{facultyId}")
    public PersonalDocuments getDocuments(@PathVariable("facultyId") String facultyId) {
        Faculty faculty = facultyService.getFacultyById(facultyId);
        return personalDocumentsService.getDocumentsByFaculty(faculty);
    }

    @PutMapping("update-documents")
    public boolean updateDocuments(@RequestBody PersonalDocuments documents) {
        return personalDocumentsService.updateDocuments(documents);
    }

    @DeleteMapping("delete-documents/{documentId}")
    public boolean deleteDocuments(@PathVariable("documentId") int documentId) {
        return personalDocumentsService.deleteDocuments(documentId);
    }
}
