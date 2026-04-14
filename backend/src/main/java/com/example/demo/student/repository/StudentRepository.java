package com.example.demo.student.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.student.entity.Student;

public interface StudentRepository extends JpaRepository<Student, String>{

	@Query("SELECT DISTINCT s.batch FROM Student s")
    List<String> findAllUniqueBatches();
	
	@Query("SELECT DISTINCT s.department FROM Student s")
    List<String> findAllUniqueDepartments();
	
	List<Student> findByDepartment(String department);
	
}
