package com.example.demo.student.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.student.entity.Internship;
import com.example.demo.student.entity.Student;

public interface InternshipRepository extends JpaRepository<Internship, Integer>{

	List<Internship> findByStudent(Student student);
	
	@Query("SELECT DISTINCT i.student.studentId FROM Internship i")
    List<String> findAllUniqueStudentIds();
	
	@Query("SELECT DISTINCT i.internshipType FROM Internship i WHERE i.student = ?1")
	List<String> findUniqueInternshipTypesByStudent(Student student);
	
}
