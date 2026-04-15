package com.example.demo.faculty.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

import com.example.demo.config.AppStoragePaths;
import com.example.demo.excel.ExcelService;
import com.example.demo.faculty.FacultyEntityChecks;
import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.service.FacultyService;
import com.example.demo.security.CustomUserDetailsService;
import com.example.demo.security.User;
import com.example.demo.security.UserRepository;
import com.example.demo.student.entity.PasswordBean;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("faculty")
@RequiredArgsConstructor
public class FacultyController {

    private static final Logger log = LoggerFactory.getLogger(FacultyController.class);

    private final FacultyService facultyService;
    private final ExcelService excelService;
    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AppStoragePaths appStoragePaths;

    @PostMapping("add-faculty")
    public boolean addFaculty(@RequestBody Faculty faculty) {
        return facultyService.addFaculty(faculty);
    }

    @GetMapping("get-faculty/{facultyId}")
    public Faculty getFacultyById(@PathVariable("facultyId") String facultyId) {
        return facultyService.getFacultyById(facultyId);
    }

    @GetMapping("get-all-faculties")
    public List<Faculty> getAllFaculties() {
        return facultyService.getAllFaculties();
    }

    @GetMapping("get-unique-designations")
    public List<String> getUniqueDesignations() {
        return facultyService.getAllUniqueDesignations();
    }

    @GetMapping("get-unique-departments")
    public List<String> getUniqueDepartments() {
        return facultyService.getAllUniqueDepartments();
    }

    @PutMapping("update-faculty/{facultyId}")
    public boolean updateFaculty(@PathVariable("facultyId") String facultyId, @RequestBody Faculty faculty) {
        return facultyService.updateFaculty(faculty);
    }

    /**
     * Self-service profile update. Creates a {@link Faculty} row on first save if none exists
     * (same id as login / JWT subject).
     */
    @PutMapping("me")
    public boolean updateMyProfile(Principal principal, @RequestBody Faculty patch) {
        String uid = principal.getName();
        Faculty existing = facultyService.getFacultyById(uid);
        if (!FacultyEntityChecks.isPersisted(existing)) {
            Faculty created = new Faculty();
            created.setFacultyId(uid);
            created.setGender(false);
            copyFacultyPatch(created, patch);
            if (created.getFacultyName() == null || created.getFacultyName().isBlank()) {
                created.setFacultyName(uid);
            }
            return facultyService.addFaculty(created);
        }
        copyFacultyPatch(existing, patch);
        return facultyService.updateFaculty(existing);
    }

    private static void copyFacultyPatch(Faculty target, Faculty patch) {
        if (patch.getFacultyName() != null) {
            target.setFacultyName(patch.getFacultyName());
        }
        if (patch.getDepartment() != null) {
            target.setDepartment(patch.getDepartment());
        }
        if (patch.getEmailId() != null) {
            target.setEmailId(patch.getEmailId());
        }
        if (patch.getContactNumber() != null) {
            target.setContactNumber(patch.getContactNumber());
        }
        if (patch.getAddress() != null) {
            target.setAddress(patch.getAddress());
        }
        if (patch.getDesignation() != null) {
            target.setDesignation(patch.getDesignation());
        }
        if (patch.getDateOfBirth() != null) {
            target.setDateOfBirth(patch.getDateOfBirth());
        }
    }

    @DeleteMapping("delete-faculty/{facultyId}")
    public boolean deleteFaculty(@PathVariable("facultyId") String facultyId) {
        return facultyService.deleteFaculty(facultyId);
    }

    @PostMapping("set-faculty-image")
    public ResponseEntity<String> setFacultyImage(@RequestParam("file") MultipartFile file, Principal principal) {
        try {
            String fileName = principal.getName() + "_" + UUID.randomUUID().toString() + ".JPG";
            Path uploadPath = appStoragePaths.getFacultyProfilePictures().resolve(fileName);
            Files.createDirectories(uploadPath.getParent());
            Files.copy(file.getInputStream(), uploadPath);
            Faculty faculty = facultyService.getFacultyById(principal.getName());
            faculty.setProfilePicture("/faculty_profile_pictures/" + fileName);
            facultyService.updateFaculty(faculty);
            return ResponseEntity.ok("Image uploaded successfully. Path: /faculty_profile_pictures/" + fileName);
        } catch (IOException e) {
            log.error("Failed to upload faculty image for {}", principal.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }

    @GetMapping("/excel")
    public ResponseEntity<Resource> download() throws IOException {
        String filename = "faculty.xlsx";
        ByteArrayInputStream actualData = excelService.getFacultyData();
        InputStreamResource file = new InputStreamResource(actualData);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(file);
    }

    @PostMapping("change-password")
    public boolean changePassword(Principal principal, @RequestBody PasswordBean passwordBean) {
        try {
            User user = customUserDetailsService.getUserByUsername(principal.getName());
            if (passwordEncoder.matches(passwordBean.getCurrentPassword(), user.getPassword())) {
                String newPasswordEncoded = passwordEncoder.encode(passwordBean.getNewPassword());
                user.setPassword(newPasswordEncoded);
                userRepository.save(user);
                return false;
            }
            return true;
        } catch (Exception e) {
            log.error("Error changing password for faculty {}", principal.getName(), e);
            return true;
        }
    }
}
