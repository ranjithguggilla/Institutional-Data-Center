package com.example.demo.excel;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.example.demo.student.entity.Certification;
import com.example.demo.student.entity.Internship;
import com.example.demo.student.entity.Project;
import com.example.demo.student.entity.Skill;
import com.example.demo.student.entity.Student;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

public class ExcelExporter {

    public static void exportStudentDataToExcel(Student student, List<Certification> certifications,
                                                List<Internship> internships, List<Skill> skills,
                                                List<Project> projects, String filePath) throws IOException {
        Workbook workbook = new XSSFWorkbook(); // Create a new Excel workbook (XLSX format)
        
        Sheet sheet = workbook.createSheet("Student Details"); // Create a new sheet
        
        Row row = sheet.createRow(0); // Create a new row
        
        // Write student details to the first row
        row.createCell(0).setCellValue(student.getStudentId());
        row.createCell(1).setCellValue(student.getStudentName());
        // Add more cells for other student details
        
        // Write certification details
        for (Certification certification : certifications) {
            row = sheet.createRow(sheet.getLastRowNum() + 1); // Move to the next row
            row.createCell(0).setCellValue(certification.getCertificationName());
            // Add more cells for certification details
        }
        
        // Write internship details
        for (Internship internship : internships) {
            row = sheet.createRow(sheet.getLastRowNum() + 1); // Move to the next row
            row.createCell(0).setCellValue(internship.getInternshipName());
            // Add more cells for internship details
        }
        
        // Write skill details
        for (Skill skill : skills) {
            row = sheet.createRow(sheet.getLastRowNum() + 1); // Move to the next row
            row.createCell(0).setCellValue(skill.getSkill());
            // Add more cells for skill details
        }
        
        // Write project details
        for (Project project : projects) {
            row = sheet.createRow(sheet.getLastRowNum() + 1); // Move to the next row
            row.createCell(0).setCellValue(project.getProjectTitle());
            // Add more cells for project details
        }
        
        // Write the workbook content to a file
        try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
            workbook.write(fileOut);
        }
        
        workbook.close(); // Close the workbook
    }
}