package com.example.demo.faculty.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.example.demo.faculty.entity.Faculty;
import java.util.List;

public interface FacultyRepository extends JpaRepository<Faculty, String> {
    
    @Query("SELECT DISTINCT f.department FROM Faculty f")
    List<String> findAllUniqueDepartments();
    
    @Query("SELECT DISTINCT f.designation FROM Faculty f")
    List<String> findAllUniqueDesignations();
    
}

