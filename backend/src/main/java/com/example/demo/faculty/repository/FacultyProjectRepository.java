package com.example.demo.faculty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.FacultyProject;

public interface FacultyProjectRepository extends JpaRepository<FacultyProject, Integer>{
	List<FacultyProject> findByFaculty(Faculty faculty);
}
