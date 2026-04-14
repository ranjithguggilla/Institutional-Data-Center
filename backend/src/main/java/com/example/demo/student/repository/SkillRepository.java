package com.example.demo.student.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.demo.student.entity.Skill;
import com.example.demo.student.entity.Student;

public interface SkillRepository extends JpaRepository<Skill, Integer>{

    @Query("SELECT DISTINCT s.domain FROM Skill s")
    List<String> findAllUniqueDomains();
    
    @Query("SELECT DISTINCT s.domain FROM Skill s WHERE s.student = ?1")
    List<String> findAllUniqueDomainsByStudent(Student student);
    
    @Query("SELECT DISTINCT s.student.studentId FROM Skill s")
    List<String> findAllUniqueStudentIds();
    
    List<Skill> findByStudent(Student student);
}