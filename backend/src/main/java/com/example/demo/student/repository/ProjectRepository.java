package com.example.demo.student.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.student.entity.Project;
import com.example.demo.student.entity.Student;

public interface ProjectRepository extends JpaRepository<Project, Integer>{

	List<Project> findByStudent(Student student);
}
