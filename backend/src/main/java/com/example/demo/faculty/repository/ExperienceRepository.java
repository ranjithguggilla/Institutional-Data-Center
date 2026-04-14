package com.example.demo.faculty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.faculty.entity.Experience;
import com.example.demo.faculty.entity.Faculty;

public interface ExperienceRepository extends JpaRepository<Experience, Integer>{

	List<Experience> findByFaculty(Faculty faculty);
	
	@Query("SELECT DISTINCT e.company FROM Experience e")
	List<String> findAllUniqueExperiences();
	
	@Query("SELECT DISTINCT e.faculty.facultyId FROM Experience e")
    List<String> findAllUniqueExperienceFacultyIds();
	
	@Query("SELECT DISTINCT e.company FROM Experience e WHERE e.faculty = ?1")
	List<String> findUniqueExperienceCompanyByFaculty(Faculty faculty);
}
