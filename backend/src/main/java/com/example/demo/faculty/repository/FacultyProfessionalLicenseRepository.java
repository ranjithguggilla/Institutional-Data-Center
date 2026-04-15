package com.example.demo.faculty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.FacultyProfessionalLicense;

public interface FacultyProfessionalLicenseRepository extends JpaRepository<FacultyProfessionalLicense, Integer> {

    List<FacultyProfessionalLicense> findByFacultyOrderByExpiryDateDesc(Faculty faculty);
}
