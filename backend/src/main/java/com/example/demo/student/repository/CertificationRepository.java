package com.example.demo.student.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.student.entity.Certification;
import com.example.demo.student.entity.Student;

public interface CertificationRepository extends JpaRepository<Certification, Integer>{

	List<Certification> findByStudent(Student student);
	
	@Query("SELECT DISTINCT c.verification FROM Certification c WHERE c.type = 'Technical'")
	List<String> findUniqueTechnicalVerifications();
	
	@Query("SELECT DISTINCT c.verification FROM Certification c WHERE c.type = 'Non-Technical'")
	List<String> findUniqueNonTechnicalVerifications();
	
	@Query("SELECT DISTINCT c.student.studentId FROM Certification c")
    List<String> findAllUniqueCertifcationStudentIds();
	
    @Query("SELECT DISTINCT c.verification FROM Certification c WHERE c.student = ?1")
    List<String> findAllUniqueVerificationsByStudent(Student student);
}
