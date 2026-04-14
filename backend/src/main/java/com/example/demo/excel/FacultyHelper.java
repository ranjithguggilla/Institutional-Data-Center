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

import com.example.demo.faculty.entity.Experience;
import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.FacultyCertification;
import com.example.demo.faculty.entity.FacultyProject;
import com.example.demo.faculty.entity.ResearchPapers;
import com.example.demo.faculty.service.ExperienceService;
import com.example.demo.faculty.service.FacultyCertificationService;
import com.example.demo.faculty.service.FacultyProjectService;
import com.example.demo.faculty.service.ResearchPapersService;

public class FacultyHelper {

    private static final Logger log = LoggerFactory.getLogger(FacultyHelper.class);

    public static String[] HEADERS = {
            "facultyId", "facultyName", "gender", "dateOfBirth", "department", "emailId", "contactNumber",
            "address", "designation", "certifications", "researchPapers", "experience", "projects"
    };

    public static String SHEET_NAME = "faculty_data";

    private final FacultyCertificationService certificationService;
    private final ResearchPapersService researchPaperService;
    private final ExperienceService experienceService;
    private final FacultyProjectService projectService;

    public FacultyHelper(FacultyCertificationService certificationService, ResearchPapersService researchPaperService,
                         ExperienceService experienceService, FacultyProjectService projectService) {
        this.certificationService = certificationService;
        this.researchPaperService = researchPaperService;
        this.experienceService = experienceService;
        this.projectService = projectService;
    }

    public ByteArrayInputStream dataToExcel(List<Faculty> faculties) {
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
            for (Faculty faculty : faculties) {
                Row dataRow = sheet.createRow(rowNum++);
                dataRow.createCell(0).setCellValue(faculty.getFacultyId());
                dataRow.createCell(1).setCellValue(faculty.getFacultyName());
                dataRow.createCell(2).setCellValue(faculty.getGender() ? "Male" : "Female");
                dataRow.createCell(3).setCellValue(faculty.getDateOfBirth().toString());
                dataRow.createCell(4).setCellValue(faculty.getDepartment());
                dataRow.createCell(5).setCellValue(faculty.getEmailId());
                dataRow.createCell(6).setCellValue(faculty.getContactNumber());
                dataRow.createCell(7).setCellValue(faculty.getAddress());
                dataRow.createCell(8).setCellValue(faculty.getDesignation());

                List<FacultyCertification> certifications = certificationService.getCertificationByFaculty(faculty);
                StringBuilder certificationsStr = new StringBuilder();
                for (FacultyCertification certification : certifications) {
                    certificationsStr.append(certification.toString()).append("| ");
                }
                dataRow.createCell(9).setCellValue(certificationsStr.toString());

                List<ResearchPapers> researchPapers = researchPaperService.getByFacultyObject(faculty);
                StringBuilder researchPapersStr = new StringBuilder();
                for (ResearchPapers researchPaper : researchPapers) {
                    researchPapersStr.append(researchPaper.toString()).append("| ");
                }
                dataRow.createCell(10).setCellValue(researchPapersStr.toString());

                List<Experience> experiences = experienceService.getByFacultyObject(faculty);
                StringBuilder experiencesStr = new StringBuilder();
                for (Experience experience : experiences) {
                    experiencesStr.append(experience.toString()).append("| ");
                }
                dataRow.createCell(11).setCellValue(experiencesStr.toString());

                List<FacultyProject> projects = projectService.getProjectByFaculty(faculty);
                StringBuilder projectsStr = new StringBuilder();
                for (FacultyProject project : projects) {
                    projectsStr.append(project.toString()).append("| ");
                }
                dataRow.createCell(12).setCellValue(projectsStr.toString());
            }

            workbook.write(out);
            workbook.close();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            log.error("Failed to export faculty data to Excel", e);
            return null;
        }
    }
}
