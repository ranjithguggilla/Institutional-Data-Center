package com.example.demo.faculty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.PersonalDocuments;

public interface PersonalDocumentsRepository extends JpaRepository<PersonalDocuments, Integer> {
	PersonalDocuments findByFaculty(Faculty faculty);
}
