package com.example.demo.student.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.admin.GovernanceService;
import com.example.demo.excel.ExcelService;
import com.example.demo.security.CustomUserDetailsService;
import com.example.demo.security.User;
import com.example.demo.security.UserRepository;
import com.example.demo.student.entity.PasswordBean;
import com.example.demo.student.entity.Student;
import com.example.demo.student.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("student")
@RequiredArgsConstructor
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);

    private final StudentService studentService;
    private final CustomUserDetailsService customUserDetailsService;
    private final ExcelService excelService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final GovernanceService governanceService;

    @PostMapping("add-student")
    public boolean addStudent(@RequestBody Student student, Principal principal) {
        boolean created = studentService.addStudent(student);
        if (created) {
            governanceService.recordChange(
                    principal != null ? principal.getName() : "system",
                    "STUDENT",
                    student.getStudentId(),
                    "CREATE",
                    "Student profile created");
        }
        return created;
    }

    @GetMapping("get-student/{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable("studentId") String studentId) {
        Student student = studentService.getStudentById(studentId);
        return ResponseEntity.ok().body(student);
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
            log.error("Error changing password for {}", principal.getName(), e);
            return true;
        }
    }

    @PostMapping("change-password-hod/{studentId}")
    public boolean changePasswordByHod(@RequestBody PasswordBean passwordBean, @PathVariable("studentId") String studentId) {
        try {
            User user = customUserDetailsService.getUserByUsername(studentId);
            String newPasswordEncoded = passwordEncoder.encode(passwordBean.getNewPassword());
            user.setPassword(newPasswordEncoded);
            userRepository.save(user);
        } catch (Exception e) {
            log.error("Error changing password for student {}", studentId, e);
        }
        return true;
    }

    @PostMapping("set-student-image")
    public ResponseEntity<String> setStudentImage(@RequestParam("file") MultipartFile file, Principal principal) {
        try {
            String directory = "src/main/resources/static/student_profile_pictures/";
            String fileName = principal.getName() + "_" + UUID.randomUUID().toString() + ".JPG";
            Path uploadPath = Paths.get(directory).resolve(fileName);
            Files.createDirectories(uploadPath.getParent());
            Files.copy(file.getInputStream(), uploadPath);
            Student student = studentService.getStudentById(principal.getName());
            student.setProfilePicture("/student_profile_pictures/" + fileName);
            studentService.updateStudent(student);
            return ResponseEntity.ok("Image uploaded successfully. Path: /student_profile_pictures/" + fileName);
        } catch (IOException e) {
            log.error("Failed to upload student image for {}", principal.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image.");
        }
    }

    @GetMapping("get-all-students")
    public List<Student> getAllStudents() {
        return studentService.getStudents();
    }

    @GetMapping("get-all-students-by-department/{department}")
    public List<Student> getAllStudentsByDepartment(@PathVariable("department") String department) {
        return studentService.getStudentsByDepartment(department);
    }

    @GetMapping("get-unique-batches")
    public List<String> getUniqueBatches() {
        return studentService.getAllUniqueBatches();
    }

    @GetMapping("get-unique-departments")
    public List<String> getUniqueDepartments() {
        return studentService.getAllUniqueDepartments();
    }

    @PutMapping("update-student/{studentId}")
    public boolean updateStudent(@PathVariable("studentId") String studentId, @RequestBody Student student, Principal principal) {
        if (principal != null && !principal.getName().equals(studentId)) {
            User editor = customUserDetailsService.getUserByUsername(principal.getName());
            boolean isAdmin = editor != null && "ADMIN".equalsIgnoreCase(editor.getRole());
            if (!isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own student profile.");
            }
        }
        student.setStudentId(studentId);
        boolean updated = studentService.updateStudent(student);
        if (updated) {
            governanceService.recordChange(
                    principal != null ? principal.getName() : "system",
                    "STUDENT",
                    studentId,
                    "UPDATE",
                    "Student profile updated");
        }
        return updated;
    }

    @DeleteMapping("delete-student/{studentId}")
    public boolean deleteStudent(@PathVariable("studentId") String studentId, Principal principal) {
        boolean deleted = studentService.deleteStudent(studentId);
        if (deleted) {
            governanceService.recordChange(
                    principal != null ? principal.getName() : "system",
                    "STUDENT",
                    studentId,
                    "DELETE",
                    "Student profile deleted");
        }
        return deleted;
    }

    @GetMapping("/excel")
    public ResponseEntity<Resource> download() throws IOException {
        String filename = "students.xlsx";
        ByteArrayInputStream actualData = excelService.getActualData();
        InputStreamResource file = new InputStreamResource(actualData);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(file);
    }
}
