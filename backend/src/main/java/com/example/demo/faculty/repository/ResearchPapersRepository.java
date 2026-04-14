package com.example.demo.faculty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.ResearchPapers;

public interface ResearchPapersRepository extends JpaRepository<ResearchPapers, Integer>{
	
	List<ResearchPapers> findByFaculty(Faculty faculty);
	
	@Query("SELECT DISTINCT p.faculty.facultyId FROM ResearchPapers p")
    List<String> findAllUniqueResearchPapersFacultyIds();
	
	@Query("SELECT DISTINCT p.publishedTitle FROM ResearchPapers p WHERE p.faculty = ?1")
	List<String> findUniqueResearchPapersCompanyByFaculty(Faculty faculty);
}
