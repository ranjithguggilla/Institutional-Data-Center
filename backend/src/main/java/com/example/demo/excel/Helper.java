package com.example.demo.excel;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.demo.student.entity.Certification;
import com.example.demo.student.entity.Internship;
import com.example.demo.student.entity.Project;
import com.example.demo.student.entity.Skill;
import com.example.demo.student.entity.Student;
import com.example.demo.student.service.CertificationService;
import com.example.demo.student.service.InternshipService;
import com.example.demo.student.service.ProjectService;
import com.example.demo.student.service.SkillService;

public class Helper {

    private static final Logger log = LoggerFactory.getLogger(Helper.class);

    public static String[] HEADERS = {
            "studentid", "name", "gender", "batch", "email", "mobile", "cgpa", "department",
            "certifications", "internships", "skills", "projects"
    };

    public static String SHEET_NAME = "student_data";

    private final CertificationService certificationService;
    private final InternshipService internshipService;
    private final SkillService skillService;
    private final ProjectService projectService;

    public Helper(CertificationService certificationService, InternshipService internshipService,
                  SkillService skillService, ProjectService projectService) {
        this.certificationService = certificationService;
        this.internshipService = internshipService;
        this.skillService = skillService;
        this.projectService = projectService;
    }

    public ByteArrayInputStream dataToExcel(List<Student> students) {
        try {
            Workbook workbook = new XSSFWorkbook();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Sheet sheet = workbook.createSheet(SHEET_NAME);

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(HEADERS[i]);
            }

            int rowNum = 1;
            for (Student student : students) {
                Row dataRow = sheet.createRow(rowNum++);
                dataRow.createCell(0).setCellValue(student.getStudentId());
                dataRow.createCell(1).setCellValue(student.getStudentName());
                dataRow.createCell(2).setCellValue(student.isStudentGender() ? "Male" : "Female");
                dataRow.createCell(3).setCellValue(student.getBatch());
                dataRow.createCell(4).setCellValue(student.getEmailId());
                dataRow.createCell(5).setCellValue(student.getMobileNumber());
                dataRow.createCell(6).setCellValue(student.getCgpa());
                dataRow.createCell(7).setCellValue(student.getDepartment());

                List<Certification> certifications = certificationService.getCertificationByStudent(student);
                StringBuilder certificationsStr = new StringBuilder();
                for (Certification certification : certifications) {
                    certificationsStr.append(certification.toString()).append("| ");
                }
                dataRow.createCell(8).setCellValue(certificationsStr.toString());

                List<Internship> internships = internshipService.getInternshipByStudent(student);
                StringBuilder internshipsStr = new StringBuilder();
                for (Internship internship : internships) {
                    internshipsStr.append(internship.toString()).append("| ");
                }
                dataRow.createCell(9).setCellValue(internshipsStr.toString());

                List<Skill> skills = skillService.getSkillByStudent(student);
                StringBuilder skillsStr = new StringBuilder();
                for (Skill skill : skills) {
                    skillsStr.append(skill.toString()).append("| ");
                }
                dataRow.createCell(10).setCellValue(skillsStr.toString());

                List<Project> projects = projectService.getProjectByStudent(student);
                StringBuilder projectsStr = new StringBuilder();
                for (Project project : projects) {
                    projectsStr.append(project.toString()).append("| ");
                }
                dataRow.createCell(11).setCellValue(projectsStr.toString());
            }

            workbook.write(out);
            workbook.close();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            log.error("Failed to export student data to Excel", e);
            return null;
        }
    }
}
