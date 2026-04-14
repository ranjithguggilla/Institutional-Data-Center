package com.example.demo.faculty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.faculty.entity.Faculty;
import com.example.demo.faculty.entity.Social;

public interface SocialRepository extends JpaRepository<Social, Integer>{

	List<Social> findByFaculty(Faculty faculty);
}
