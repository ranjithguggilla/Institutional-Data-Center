package com.example.demo.faculty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.faculty.entity.FacultyCertification;
import com.example.demo.faculty.entity.Faculty;

public interface FacultyCertificationRepository extends JpaRepository<FacultyCertification, Integer> {
	
	List<FacultyCertification> findByFaculty(Faculty faculty);
	
	@Query("SELECT DISTINCT p.faculty.facultyId FROM FacultyCertification p")
    List<String> findAllUniqueFacultyCertificationFacultyIds();
	
	@Query("SELECT DISTINCT p.verification FROM FacultyCertification p WHERE p.faculty = ?1")
	List<String> findUniqueFacultyCertificationVerificationByFaculty(Faculty faculty);
}
